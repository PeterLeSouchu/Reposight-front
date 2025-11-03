import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  private: boolean;
  language: string | null;
  updated_at: string;
  html_url: string;
}

export function useQueryGitHubRepos(enabled: boolean = true) {
  return useQuery({
    queryKey: ["repos", "github"],
    queryFn: async () => {
      const response = await api.get<GitHubRepo[]>("/repos/github");
      return response.data;
    },
    enabled: enabled,
  });
}
