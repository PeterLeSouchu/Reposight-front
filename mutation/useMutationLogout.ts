import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";

export function useMutationLogout() {
  return useMutation({
    mutationFn: async () => {
      // Nettoyer le token d'accès en mémoire avant la requête
      useAuthStore.getState().clearAccessToken();

      // Essayer d'appeler le backend avec credentials pour permettre la suppression du cookie
      try {
        // Utiliser withCredentials: true pour cette requête spécifique
        // pour que le backend puisse supprimer le cookie refresh_token
        const response = await api.post("/auth/logout");
        return response.data;
      } catch (error) {
        // On ignore l'erreur car on va faire le logout côté client de toute façon
        return null;
      }
    },
  });
}
