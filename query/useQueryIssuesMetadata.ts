import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface IssueAuthor {
  username: string;
  avatar: string;
}

export interface IssuesMetadata {
  authors: IssueAuthor[];
  states: string[];
}

export function useQueryIssuesMetadata(repoId: number | null) {
  return useQuery({
    queryKey: ["repo", repoId, "issues", "metadata"],
    queryFn: async () => {
      if (!repoId) {
        throw new Error("repoId is required");
      }
      const response = await api.get<IssuesMetadata>(
        `/repos/${repoId}/issues/metadata`
      );
      return response.data;
    },
    enabled: !!repoId,
  });
}
