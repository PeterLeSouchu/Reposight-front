import { CircleDot, ExternalLink, MessageCircle } from "lucide-react";

import { formatRelativeDate } from "@/lib/utils";
import type { Issue } from "@/types/repository";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ErrorMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/EmptyState";
import { useQueryIssuesMetadata } from "@/query/useQueryIssuesMetadata";
import { Pagination } from "./Pagination";
import type { IssueFilters } from "./ActivityTabs";
import type { IssuesResponse } from "@/query/useQueryIssues";

interface IssueTabContentProps {
  repoId: number;
  filters: IssueFilters;
  onFiltersChange: (update: Partial<IssueFilters>) => void;
  issues?: IssuesResponse | null;
  issuesLoading: boolean;
  issuesFetching: boolean;
  issuesError: unknown;
}

const ISSUE_STATE_LABEL: Record<string, string> = {
  open: "Ouverte",
  closed: "Fermée",
};

const ISSUE_STATE_STYLES: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  closed: "bg-ink/5 text-ink/60",
};

export function IssueTabContent({
  repoId,
  filters,
  onFiltersChange,
  issues,
  issuesLoading,
  issuesFetching,
  issuesError,
}: IssueTabContentProps) {
  const {
    data: metadata,
    isLoading: metadataLoading,
    error: metadataError,
  } = useQueryIssuesMetadata(repoId);

  const authors = metadata?.authors ?? [];
  const states = metadata?.states ?? [];
  const selectedAuthorData = authors.find(
    (author) => author.username === filters.author
  );

  const issuesList: Issue[] = issues?.issues ?? [];
  const totalPages = issues?.pagination?.totalPages ?? 0;
  const isLoadingList = (issuesLoading && !issues) || issuesFetching;

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
                    {ISSUE_STATE_LABEL[state] ?? state}
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
      ) : issuesError ? (
        <ErrorMessage error={issuesError} variant="inline" />
      ) : issuesList.length > 0 ? (
        <>
          <div className="divide-y divide-iris-100 overflow-hidden rounded-xl border border-iris-100">
            {issuesList.map((issue) => {
              const stateLabel = ISSUE_STATE_LABEL[issue.state] ?? issue.state;
              const stateStyles =
                ISSUE_STATE_STYLES[issue.state] ??
                "bg-ink/5 text-ink/60";

              return (
                <a
                  key={issue.number}
                  href={issue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white p-4 transition-colors hover:bg-iris-50/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${stateStyles}`}
                        >
                          {stateLabel}
                        </span>
                        <span className="text-sm font-semibold text-ink transition-colors group-hover:text-iris-700">
                          {issue.title}
                        </span>
                        <span className="text-xs text-ink/50">
                          #{issue.number}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-ink/50">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={issue.author.avatar}
                            alt={issue.author.login}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{issue.author.login}</span>
                        </div>
                        <span>•</span>
                        <span>
                          Ouverte{" "}
                          {formatRelativeDate(new Date(issue.createdAt))}
                        </span>
                        {issue.updatedAt && (
                          <>
                            <span>•</span>
                            <span>
                              Mise à jour{" "}
                              {formatRelativeDate(new Date(issue.updatedAt))}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={12} />
                          {issue.comments}
                        </span>
                      </div>
                      {issue.labels.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          {issue.labels.map((label) => (
                            <span
                              key={label}
                              className="rounded-full bg-iris-50 px-2 py-0.5 text-xs text-iris-700"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}
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
          icon={<CircleDot size={18} />}
          title="Aucune issue disponible"
          description="Tout est calme pour le moment. Essayez d'autres filtres ou revenez plus tard."
        />
      )}
    </>
  );
}
