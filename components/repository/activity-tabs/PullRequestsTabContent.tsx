import { ExternalLink, GitPullRequest } from "lucide-react";

import { formatRelativeDate } from "@/lib/utils";
import type { PullRequest } from "@/types/repository";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ErrorMessage";
import { EmptyState } from "@/components/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PullRequestsResponse } from "@/query/useQueryPullRequests";
import { useQueryPullRequestsMetadata } from "@/query/useQueryPullRequestsMetadata";
import { Pagination } from "./Pagination";
import type { PullRequestFilters } from "./ActivityTabs";

interface PullRequestsTabContentProps {
  repoId: number;
  filters: PullRequestFilters;
  onFiltersChange: (update: Partial<PullRequestFilters>) => void;
  pullRequests?: PullRequestsResponse | null;
  pullRequestsLoading: boolean;
  pullRequestsFetching: boolean;
  pullRequestsError: unknown;
}

const PR_STATE_LABEL: Record<string, string> = {
  open: "Ouverte",
  closed: "Fermée",
  merged: "Fusionnée",
};

export function PullRequestsTabContent({
  repoId,
  filters,
  onFiltersChange,
  pullRequests,
  pullRequestsLoading,
  pullRequestsFetching,
  pullRequestsError,
}: PullRequestsTabContentProps) {
  const {
    data: metadata,
    isLoading: metadataLoading,
    error: metadataError,
  } = useQueryPullRequestsMetadata(repoId);

  const authors = metadata?.authors ?? [];
  const states = metadata?.states ?? [];
  const selectedAuthorData = authors.find(
    (author) => author.username === filters.author
  );

  const pullRequestsList: PullRequest[] = pullRequests?.pullRequests ?? [];
  const totalPages = pullRequests?.pagination?.totalPages ?? 0;
  const isLoadingList =
    (pullRequestsLoading && !pullRequests) || pullRequestsFetching;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {metadataLoading ? (
          <>
            <Skeleton className="h-9 w-[180px] rounded-full" />
            <Skeleton className="h-9 w-[180px] rounded-full" />
            <Skeleton className="h-9 w-[140px] rounded-full" />
          </>
        ) : metadataError ? (
          <div className="w-full">
            <ErrorMessage error={metadataError} variant="inline" />
          </div>
        ) : (
          <>
            <Select
              value={filters.state}
              onValueChange={(value) => {
                onFiltersChange({ state: value, page: 1 });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder="Tous les états"
                  className="truncate"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les états</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {PR_STATE_LABEL[state] ?? state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.author}
              onValueChange={(value) => {
                onFiltersChange({ author: value, page: 1 });
              }}
            >
              <SelectTrigger className="w-[180px]">
                {selectedAuthorData ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedAuthorData.avatar}
                      alt={selectedAuthorData.username}
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="truncate max-w-[110px]">
                      {selectedAuthorData.username}
                    </span>
                  </div>
                ) : (
                  <SelectValue
                    placeholder="Tous les auteurs"
                    className="truncate"
                  />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les auteurs</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author.username} value={author.username}>
                    <div className="flex items-center gap-2">
                      <img
                        src={author.avatar}
                        alt={author.username}
                        className="w-4 h-4 rounded-full"
                      />
                      <span className="truncate max-w-[140px]">
                        {author.username}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(filters.perPage)}
              onValueChange={(value) => {
                onFiltersChange({ perPage: Number(value), page: 1 });
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="5 par page" className="truncate" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value} par page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      {isLoadingList ? (
        <div className="divide-y divide-iris-100 overflow-hidden rounded-xl border border-iris-100">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : pullRequestsError ? (
        <ErrorMessage error={pullRequestsError} variant="inline" />
      ) : pullRequestsList.length > 0 ? (
        <>
          <div className="divide-y divide-iris-100 overflow-hidden rounded-xl border border-iris-100">
            {pullRequestsList.map((pr) => {
              const stateStyles =
                pr.state === "merged"
                  ? "bg-iris-100 text-iris-700"
                  : pr.state === "open"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700";

              return (
                <a
                  key={pr.number}
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white p-4 transition-colors hover:bg-iris-50/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${stateStyles}`}
                        >
                          {PR_STATE_LABEL[pr.state] ?? pr.state}
                        </span>
                        <span className="text-sm font-semibold text-ink transition-colors group-hover:text-iris-700">
                          {pr.title}
                        </span>
                        <span className="text-xs text-ink/50">
                          #{pr.number}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-ink/50">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={pr.author.avatar}
                            alt={pr.author.login}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{pr.author.login}</span>
                        </div>
                        <span>•</span>
                        <span>
                          Créée {formatRelativeDate(new Date(pr.createdAt))}
                        </span>
                        {pr.updatedAt && (
                          <>
                            <span>•</span>
                            <span>
                              Mise à jour{" "}
                              {formatRelativeDate(new Date(pr.updatedAt))}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ExternalLink
                      size={16}
                      className="shrink-0 text-ink/30 transition-colors group-hover:text-iris-600"
                    />
                  </div>
                </a>
              );
            })}
          </div>

          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => onFiltersChange({ page })}
          />
        </>
      ) : (
        <EmptyState
          icon={<GitPullRequest size={18} />}
          title="Aucune pull request trouvée"
          description="Ajustez vos filtres ou créez une pull request pour la voir ici."
        />
      )}
    </>
  );
}
