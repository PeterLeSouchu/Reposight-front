import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "./authStore";

// Instance principale sans credentials par défaut
// On peut activer withCredentials: true dans les options des requêtes spécifiques
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: false, // Pas de cookies par défaut
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requête pour injecter le token d'accès si présent
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag pour éviter les boucles infinies et les refresh multiples simultanés
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor pour gérer le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Vérifier si c'est une erreur 401 avec message "jwt access token expired"
    const errorData = error.response?.data;
    const errorMessage =
      errorData &&
      typeof errorData === "object" &&
      "message" in errorData &&
      typeof errorData.message === "string"
        ? errorData.message
        : null;

    if (
      error.response?.status === 401 &&
      errorMessage === "jwt access token expired" &&
      !originalRequest._retry
    ) {
      // Si on est déjà en train de refresh, mettre la requête en queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Appeler la route de refresh avec withCredentials: true pour recevoir/envoyer les cookies
        const response = await api.post(
          "/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );

        // Sauvegarder le nouvel accessToken en mémoire
        const { accessToken } = (response.data as any) ?? {};
        if (accessToken) {
          useAuthStore.getState().setAccessToken(accessToken);
          // Mettre à jour l'en-tête de la requête originale pour éviter une 2e 401
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${accessToken}`,
          } as any;
        }

        // Traiter la queue avec succès
        processQueue(null, response.data);
        isRefreshing = false;

        // Réessayer la requête initiale
        return api(originalRequest);
      } catch (refreshError) {
        // Traiter la queue avec l'erreur
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;

        // Nettoyer le token en mémoire
        try {
          useAuthStore.getState().clearAccessToken();
        } catch {}

        // Vérifier si l'erreur de refresh contient "jwt refresh token expired"
        const refreshErrorData = (refreshError as AxiosError).response?.data;
        const refreshErrorMessage =
          refreshErrorData &&
          typeof refreshErrorData === "object" &&
          "message" in refreshErrorData &&
          typeof refreshErrorData.message === "string"
            ? refreshErrorData.message
            : null;

        // Rediriger vers /login si le refresh_token est expiré ou invalide
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // Si c'est une erreur 401 avec message "jwt refresh token expired", rediriger vers /login
    if (
      error.response?.status === 401 &&
      errorMessage === "jwt refresh token expired"
    ) {
      // Nettoyer le token en mémoire
      try {
        useAuthStore.getState().clearAccessToken();
      } catch {}

      // Rediriger vers /login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
