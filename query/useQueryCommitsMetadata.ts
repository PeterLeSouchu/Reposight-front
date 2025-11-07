import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Author {
  username: string;
  avatar: string;
}

export interface CommitsMetadata {
  authors: Author[];
  branches: string[];
}

export function useQueryCommitsMetadata(repoId: number | null) {
  return useQuery({
    queryKey: ["repo", repoId, "commits", "metadata"],
    queryFn: async () => {
      if (!repoId) {
        throw new Error("repoId is required");
      }
      const response = await api.get<CommitsMetadata>(
        `/repos/${repoId}/commits/metadata`
      );
      return response.data;
    },
    enabled: !!repoId, // Only run query if repoId is available
  });
}
