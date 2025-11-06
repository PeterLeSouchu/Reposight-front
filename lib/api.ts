import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { useAuthStore } from "./authStore";

interface RefreshTokenResponse {
  accessToken: string;
}

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
    config.headers = (config.headers ?? {}) as AxiosRequestHeaders;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag pour éviter les boucles infinies et les refresh multiples simultanés
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
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

    // Vérifier si c'est une erreur 401 avec message "Token d'accès JWT expiré"
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
      errorMessage === "Token d'accès JWT expiré" &&
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
        const response = await api.post(
          "/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );

        // Sauvegarder le nouvel accessToken en mémoire
        const refreshData = response.data as RefreshTokenResponse;
        const accessToken = refreshData?.accessToken;
        if (accessToken) {
          useAuthStore.getState().setAccessToken(accessToken);
          // Mettre à jour l'en-tête de la requête originale pour éviter une 2e 401
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${accessToken}`,
          } as AxiosRequestHeaders;
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

        useAuthStore.getState().clearAccessToken();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // Si c'est une erreur 401 avec message "Refresh token JWT expiré", rediriger vers /login
    if (
      error.response?.status === 401 &&
      errorMessage === "Refresh token JWT expiré"
    ) {
      useAuthStore.getState().clearAccessToken();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
