import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface Repo {
  id: string;
  name: string;
  description: string;
  addedDate: string; // ISO string
  lastCommit: {
    message: string;
    author: string;
    date: string;
    hash: string;
    dateTime: string; // ISO string
  };
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
