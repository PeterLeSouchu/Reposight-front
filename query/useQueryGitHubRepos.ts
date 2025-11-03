import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Repo } from "@/types/repo";

export function useQueryGitHubRepos(enabled: boolean = true) {
  return useQuery({
    queryKey: ["repos", "github"],
    queryFn: async () => {
      const response = await api.get<Repo[]>("/repos/github");
      return response.data;
    },
    enabled: enabled,
  });
}
