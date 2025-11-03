import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export function useMutationDeleteRepo() {
  return useMutation({
    mutationFn: async (repoId: number) => {
      const response = await api.delete(`/repos/${repoId}`);
      return response.data;
    },
  });
}
