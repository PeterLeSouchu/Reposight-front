import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export function useMutationSelectRepos() {
  return useMutation({
    mutationFn: async (repoIds: number[]) => {
      const response = await api.post("/repos/select", { repoIds });
      return response.data;
    },
  });
}
