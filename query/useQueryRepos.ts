import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Repo } from "@/types/repo";

export function useQueryRepos() {
  return useQuery({
    queryKey: ["repos"],
    queryFn: async () => {
      const response = await api.get<Repo[]>("/repos");
      return response.data;
    },
  });
}
