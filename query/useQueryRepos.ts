import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface Repo {
  repoId: string;
  name: string;
  description: string;
  selectedAt?: string; // ISO string
  updatedAt: string;
}

export function useQueryRepos() {
  return useQuery({
    queryKey: ["repos"],
    queryFn: async () => {
      const response = await api.get<Repo[]>("/repos");
      return response.data;
    },
  });
}
