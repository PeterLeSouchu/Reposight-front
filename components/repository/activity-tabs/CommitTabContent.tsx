import { GitCommit } from "lucide-react";

import { formatRelativeDate } from "@/lib/utils";
import type { Commit } from "@/types/repository";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ErrorMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CommitsResponse } from "@/query/useQueryCommits";
import { useQueryCommitsMetadata } from "@/query/useQueryCommitsMetadata";
import { buildPagination } from "./utils/pagination";
import type { CommitFilters } from "./ActivityTabs";

interface CommitTabContentProps {
  repoId: number;
  filters: CommitFilters;
  onFiltersChange: (update: Partial<CommitFilters>) => void;
  commits?: CommitsResponse | null;
  commitsLoading: boolean;
  commitsFetching: boolean;
  commitsError: unknown;
}

export function CommitTabContent({
  repoId,
  filters,
  onFiltersChange,
  commits,
  commitsLoading,
  commitsFetching,
  commitsError,
}: CommitTabContentProps) {
  const {
    data: metadata,
    isLoading: metadataLoading,
    error: metadataError,
  } = useQueryCommitsMetadata(repoId);

  const authors = metadata?.authors ?? [];
  const branches = metadata?.branches ?? [];
  const selectedAuthorData = authors.find(
    (author) => author.username === filters.author
  );

  const commitsList: Commit[] = commits?.commits ?? [];
  const totalPages = commits?.pagination?.totalPages ?? 0;
  const isLoadingList = (commitsLoading && !commits) || commitsFetching;
  const paginationItems = buildPagination(filters.page, totalPages);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {metadataLoading ? (
          <>
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[160px]" />
          </>
        ) : metadataError ? (
          <div className="w-full">
            <ErrorMessage error={metadataError} variant="inline" />
          </div>
        ) : (
          <>
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
              value={filters.branch}
              onValueChange={(value) => {
                onFiltersChange({ branch: value, page: 1 });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder="Toutes les branches"
                  className="truncate"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    <span className="truncate max-w-[160px]">{branch}</span>
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
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="10 par page" className="truncate" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((value) => (
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
              className="p-3 bg-white rounded-xl border border-violet-100"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : commitsError ? (
        <ErrorMessage error={commitsError} variant="inline" />
      ) : commitsList.length > 0 ? (
        <>
          <div className="space-y-3">
            {commitsList.map((commit) => (
              <a
                key={commit.sha}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-white rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2">
                      {commit.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={commit.author.avatar}
                          alt={commit.author.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span>{commit.author.name}</span>
                      </div>
                      <span>•</span>
                      <span>{formatRelativeDate(new Date(commit.date))}</span>
                    </div>
                  </div>
                  <span className="text-violet-600 group-hover:text-violet-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity ml-3">
                    Voir →
                  </span>
                </div>
              </a>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end pt-4 border-t border-violet-200/50">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {paginationItems.map((item, index) => {
                    if (item === "ellipsis") {
                      return (
                        <span
                          key={`commits-ellipsis-${index}`}
                          className="px-2 text-xs text-slate-400"
                        >
                          …
                        </span>
                      );
                    }

                    const isActive = item === filters.page;
                    return (
                      <button
                        key={`commits-page-${item}`}
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
        <div className="w-full rounded-xl border border-violet-100 bg-white p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <GitCommit size={18} />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-600">
            Aucun commit trouvé
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Il n'y a pas encore de commit pour ces filtres.
          </p>
        </div>
      )}
    </>
  );
}
