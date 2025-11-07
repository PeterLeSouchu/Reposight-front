import { AlertCircle, ExternalLink, MessageCircle } from "lucide-react";

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
import { buildPagination } from "./utils/pagination";
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
  closed: "bg-slate-200 text-slate-700",
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
  const paginationItems = buildPagination(filters.page, totalPages);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {metadataLoading ? (
          <>
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[140px]" />
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
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-xl border border-violet-100"
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
          <div className="space-y-3">
            {issuesList.map((issue) => {
              const stateLabel = ISSUE_STATE_LABEL[issue.state] ?? issue.state;
              const stateStyles =
                ISSUE_STATE_STYLES[issue.state] ??
                "bg-slate-200 text-slate-700";

              return (
                <a
                  key={issue.number}
                  href={issue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${stateStyles}`}
                        >
                          {stateLabel}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                          {issue.title}
                        </span>
                        <span className="text-xs text-slate-500">
                          #{issue.number}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
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
                              className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ExternalLink
                      size={16}
                      className="text-violet-500 group-hover:text-violet-600"
                    />
                  </div>
                </a>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end pt-4 border-t border-violet-200/50">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {paginationItems.map((item, index) => {
                    if (item === "ellipsis") {
                      return (
                        <span
                          key={`issues-ellipsis-${index}`}
                          className="px-2 text-xs text-slate-400"
                        >
                          …
                        </span>
                      );
                    }

                    const isActive = item === filters.page;
                    return (
                      <button
                        key={`issues-page-${item}`}
                        onClick={() => onFiltersChange({ page: item })}
                        className={`min-w-[32px] cursor-pointer h-8 rounded-md text-xs font-medium transition-all border ${
                          isActive
                            ? "bg-violet-600 text-white border-violet-600 shadow-md"
                            : "border-violet-200/60 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-600"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<AlertCircle size={20} />}
          title="Aucune issue disponible"
          description="Tout est calme pour le moment. Essayez d'autres filtres ou revenez plus tard."
        />
      )}
    </>
  );
}
