import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface PullRequestAuthor {
  username: string;
  avatar: string;
}

export interface PullRequestsMetadata {
  authors: PullRequestAuthor[];
  states: string[];
}

export function useQueryPullRequestsMetadata(repoId: number | null) {
  return useQuery({
    queryKey: ["repo", repoId, "pullRequests", "metadata"],
    queryFn: async () => {
      if (!repoId) {
        throw new Error("repoId is required");
      }
      const response = await api.get<PullRequestsMetadata>(
        `/repos/${repoId}/pull-requests/metadata`
      );
      return response.data;
    },
    enabled: !!repoId,
  });
}
