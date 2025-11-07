import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Commit } from "@/types/repository";

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CommitsResponse {
  commits: Commit[];
  pagination: Pagination;
}

export interface CommitsQueryParams {
  page?: number;
  perPage?: number;
  author?: string;
  branch?: string;
}

export function useQueryCommits(
  repoId: number | null,
  params: CommitsQueryParams = {}
) {
  return useQuery({
    queryKey: ["repo", repoId, "commits", params],
    queryFn: async () => {
      if (!repoId) {
        throw new Error("repoId is required");
      }

      const queryParams = new URLSearchParams();
      if (params.page) {
        queryParams.append("page", params.page.toString());
      }
      if (params.perPage) {
        queryParams.append("per_page", params.perPage.toString());
      }
      if (params.author && params.author !== "all") {
        queryParams.append("author", params.author);
      }
      if (params.branch && params.branch !== "all") {
        queryParams.append("branch", params.branch);
      }

      const queryString = queryParams.toString();
      const url = `/repos/${repoId}/commits${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await api.get<CommitsResponse>(url);
      return response.data;
    },
    enabled: !!repoId,
  });
}
