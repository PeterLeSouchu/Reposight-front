import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Configuration de l'instance axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: true, // Important pour les cookies de session
  headers: {
    "Content-Type": "application/json",
  },
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
    console.log("error dans l'interceptor", error);

    // Vérifier si c'est une erreur 401 avec code REFRESH_TOKEN
    if (
      error.response?.status === 401 &&
      error.response?.data &&
      typeof error.response.data === "object" &&
      "code" in error.response.data &&
      error.response.data.code === "REFRESH_TOKEN" &&
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
        // Appeler la route de refresh
        const response = await api.post("/auth/refresh", {});

        // Traiter la queue avec succès
        processQueue(null, response.data);
        isRefreshing = false;

        // Réessayer la requête initiale
        return api(originalRequest);
      } catch (refreshError) {
        // Traiter la queue avec l'erreur
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;

        // Rediriger vers /login si le refresh_token est invalide
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
