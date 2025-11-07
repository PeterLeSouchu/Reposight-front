import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PullRequest } from "@/types/repository";
import { buildQueryString, type QueryValue } from "./utils/buildQueryString";

export interface PullRequestsPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PullRequestsResponse {
  pullRequests: PullRequest[];
  pagination: PullRequestsPagination;
}

export type PullRequestsQueryParams = {
  page?: number;
  perPage?: number;
  author?: string;
  state?: string;
} & Record<string, QueryValue>;

export function useQueryPullRequests(
  repoId: number | null,
  params: PullRequestsQueryParams = {}
): UseQueryResult<PullRequestsResponse, unknown> {
  return useQuery({
    queryKey: ["repo", repoId, "pullRequests", params],
    queryFn: async () => {
      if (!repoId) {
        throw new Error("repoId is required");
      }

      const queryString = buildQueryString(params);
      const url = `/repos/${repoId}/pull-requests${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await api.get<PullRequestsResponse>(url);
      return response.data;
    },
    enabled: !!repoId,
  });
}
