import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Repo } from "@/types/repo";

export interface ReposResponse {
  repos: Repo[];
  reposDeletedFromGithub: string[];
}

export function useQueryRepos() {
  return useQuery({
    queryKey: ["repos"],
    queryFn: async () => {
      const response = await api.get<ReposResponse>("/repos");
      return response.data;
    },
  });
}
