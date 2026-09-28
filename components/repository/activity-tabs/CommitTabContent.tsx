import { GitCommit } from "lucide-react";

import { formatRelativeDate } from "@/lib/utils";
import type { Commit } from "@/types/repository";
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
import type { CommitsResponse } from "@/query/useQueryCommits";
import { useQueryCommitsMetadata } from "@/query/useQueryCommitsMetadata";
import { Pagination } from "./Pagination";
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

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {metadataLoading ? (
          <>
            <Skeleton className="h-9 w-[180px] rounded-full" />
            <Skeleton className="h-9 w-[180px] rounded-full" />
            <Skeleton className="h-9 w-[160px] rounded-full" />
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
              <SelectTrigger className="w-[200px]">
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
        <div className="divide-y divide-iris-100 overflow-hidden rounded-xl border border-iris-100">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white p-4"
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
          <div className="divide-y divide-iris-100 overflow-hidden rounded-xl border border-iris-100">
            {commitsList.map((commit) => (
              <a
                key={commit.sha}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white p-4 transition-colors hover:bg-iris-50/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-ink transition-colors group-hover:text-iris-700 line-clamp-2">
                      {commit.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-ink/50">
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
                  <span className="ml-4 shrink-0 font-mono text-xs text-iris-600">
                    {commit.sha.slice(0, 7)}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => onFiltersChange({ page })}
          />
        </>
      ) : (
        <EmptyState
          icon={<GitCommit size={18} />}
          title="Aucun commit trouvé"
          description="Il n'y a pas encore de commit pour ces filtres."
        />
      )}
    </>
  );
}
