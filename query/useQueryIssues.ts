import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Issue } from "@/types/repository";
import { buildQueryString, type QueryValue } from "./utils/buildQueryString";

export interface IssuesPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface IssuesResponse {
  issues: Issue[];
  pagination: IssuesPagination;
}

export type IssuesQueryParams = {
  page?: number;
  perPage?: number;
  author?: string;
  state?: string;
} & Record<string, QueryValue>;

export function useQueryIssues(
  repoId: number | null,
  params: IssuesQueryParams = {}
): UseQueryResult<IssuesResponse, unknown> {
  return useQuery({
    queryKey: ["repo", repoId, "issues", params],
    queryFn: async () => {
      if (!repoId) {
        throw new Error("repoId is required");
      }

      const queryString = buildQueryString(params);
      const url = `/repos/${repoId}/issues${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await api.get<IssuesResponse>(url);
      return response.data;
    },
    enabled: !!repoId,
  });
}
