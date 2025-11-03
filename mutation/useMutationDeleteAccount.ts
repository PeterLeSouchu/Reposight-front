import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export function useMutationDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/user/me", {
        withCredentials: true,
      });
      return response.data;
    },
  });
}
