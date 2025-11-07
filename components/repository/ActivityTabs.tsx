"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Circle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import type { Commit, PullRequest, Issue, TabType } from "@/types/repository";
import { useQueryCommitsMetadata } from "@/query/useQueryCommitsMetadata";
import { useQueryCommits } from "@/query/useQueryCommits";
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
import { Button } from "@/components/ui/button";

interface ActivityTabsProps {
  pullRequests: PullRequest[];
  issues: Issue[];
  repoId: number;
}

export function ActivityTabs({
  repoId,
  pullRequests,
  issues,
}: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("commits");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const {
    data: commitsMetadata,
    isLoading: isLoadingCommitsMetadata,
    error: errorCommitsMetadata,
    refetch: refetchCommitsMetadata,
  } = useQueryCommitsMetadata(repoId);

  const {
    data: commitsData,
    isLoading: isLoadingCommits,
    error: errorCommits,
    refetch: refetchCommits,
    isFetching: isFetchingCommits,
  } = useQueryCommits(repoId, {
    page,
    perPage,
    author: selectedAuthor !== "all" ? selectedAuthor : undefined,
    branch: selectedBranch !== "all" ? selectedBranch : undefined,
  });

  const selectedAuthorData = commitsMetadata?.authors.find(
    (author) => author.username === selectedAuthor
  );

  const commits = commitsData?.commits ?? [];
  const totalCommits = commitsData?.pagination?.total ?? 0;
  const totalPages = commitsData?.pagination?.totalPages ?? 0;
  const isCommitsLoading =
    (isLoadingCommits && !commitsData) || isFetchingCommits;

  const paginationItems = useMemo(() => {
    if (totalPages <= 1) {
      return [] as Array<number | "ellipsis">;
    }

    const pages = new Set<number>([1, 2, totalPages, page - 1, page, page + 1]);
    const filteredPages = Array.from(pages)
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);

    const items: Array<number | "ellipsis"> = [];
    filteredPages.forEach((p, index) => {
      if (index > 0 && p - filteredPages[index - 1] > 1) {
        items.push("ellipsis");
      }
      items.push(p);
    });

    return items;
  }, [page, totalPages]);

  const tabs = [
    {
      id: "commits" as TabType,
      label: "Commits",
      icon: GitCommit,
      count: isCommitsLoading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        totalCommits
      ),
    },
    {
      id: "pr" as TabType,
      label: "Pull Requests",
      icon: GitPullRequest,
      count: pullRequests.length,
    },
    {
      id: "issues" as TabType,
      label: "Issues",
      icon: AlertCircle,
      count: issues.length,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-50 border border-violet-200/50 rounded-2xl shadow-lg overflow-hidden mb-6"
    >
      {/* Tabs */}
      <div className="border-b border-violet-200/50 bg-white">
        <div className="flex gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const showLoader = tab.id === "commits" && isCommitsLoading;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {showLoader ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    tab.count
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-3">
          {activeTab === "commits" && (
            <>
              {isLoadingCommitsMetadata ? (
                <>
                  <Skeleton className="h-10 w-[180px]" />
                  <Skeleton className="h-10 w-[180px]" />
                  <Skeleton className="h-10 w-[160px]" />
                </>
              ) : errorCommitsMetadata ? (
                <div className="w-full">
                  <ErrorMessage
                    error={errorCommitsMetadata}
                    onRetry={() => refetchCommitsMetadata()}
                  />
                </div>
              ) : (
                <>
                  <Select
                    value={selectedAuthor}
                    onValueChange={(value) => {
                      setSelectedAuthor(value);
                      setPage(1);
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
                      {commitsMetadata?.authors.map((author) => (
                        <SelectItem
                          key={author.username}
                          value={author.username}
                        >
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
                    value={selectedBranch}
                    onValueChange={(value) => {
                      setSelectedBranch(value);
                      setPage(1);
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
                      {commitsMetadata?.branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          <span className="truncate max-w-[160px]">
                            {branch}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={String(perPage)}
                    onValueChange={(value) => {
                      setPerPage(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue
                        placeholder="10 par page"
                        className="truncate"
                      />
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
            </>
          )}

          {activeTab === "pr" && (
            <>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les états</option>
                <option>Ouvert</option>
                <option>Fermé</option>
                <option>Fusionné</option>
              </select>

              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les auteurs</option>
              </select>
            </>
          )}

          {activeTab === "issues" && (
            <>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les états</option>
                <option>Ouvert</option>
                <option>Fermé</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les auteurs</option>
              </select>
            </>
          )}
        </div>

        <div className="space-y-3">
          {activeTab === "commits" &&
            (isLoadingCommits ? (
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
            ) : errorCommits ? (
              <ErrorMessage
                error={errorCommits}
                onRetry={() => refetchCommits()}
              />
            ) : commits.length > 0 ? (
              <>
                {commits.map((commit) => (
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
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={commit.author.avatar}
                              alt={commit.author.name}
                              className="w-5 h-5 rounded-full"
                            />
                            <span>{commit.author.name}</span>
                          </div>
                          <span>•</span>
                          <span>
                            {formatRelativeDate(new Date(commit.date))}
                          </span>
                        </div>
                      </div>
                      <span className="text-violet-600 group-hover:text-violet-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity ml-3">
                        Voir →
                      </span>
                    </div>
                  </a>
                ))}
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-end pt-4 border-t border-violet-200/50">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {paginationItems.map((item, index) => {
                          if (item === "ellipsis") {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-xs  text-slate-400"
                              >
                                …
                              </span>
                            );
                          }

                          const isActive = item === page;
                          return (
                            <button
                              key={item}
                              onClick={() => setPage(item)}
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
                icon={<GitCommit size={20} />}
                title="Aucun commit trouvé"
                description="Essayez d'ajuster vos filtres ou réduisez la période affichée."
              />
            ))}

          {activeTab === "pr" &&
            (pullRequests.length > 0 ? (
              pullRequests.map((pr) => (
                <div
                  key={pr.id}
                  className="p-4 bg-white rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {pr.state === "merged" && (
                          <CheckCircle2 className="text-green-600" size={18} />
                        )}
                        {pr.state === "open" && (
                          <Circle className="text-blue-600" size={18} />
                        )}
                        {pr.state === "closed" && (
                          <XCircle className="text-red-600" size={18} />
                        )}
                        <span className="font-medium text-slate-900">
                          {pr.title}
                        </span>
                        <span className="text-xs text-slate-500">#{pr.id}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={pr.author.avatar}
                            alt={pr.author.name}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{pr.author.name}</span>
                        </div>
                        <span>•</span>
                        <span>
                          {pr.branch} → {pr.baseBranch}
                        </span>
                        <span>•</span>
                        <span>{formatRelativeDate(new Date(pr.date))}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {pr.labels.map((label) => (
                          <span
                            key={label}
                            className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded"
                          >
                            {label}
                          </span>
                        ))}
                        {pr.reviewers.length > 0 && (
                          <div className="flex items-center gap-1 ml-2">
                            {pr.reviewers.map((reviewer, idx) => (
                              <img
                                key={idx}
                                src={reviewer.avatar}
                                alt={reviewer.name}
                                className={`w-5 h-5 rounded-full border-2 ${
                                  reviewer.approved
                                    ? "border-green-500"
                                    : "border-slate-300"
                                }`}
                                title={reviewer.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-violet-600 hover:text-violet-700 ml-4"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<GitPullRequest size={20} />}
                title="Aucune pull request"
                description="Les pull requests apparaîtront ici dès qu'elles seront disponibles."
              />
            ))}

          {activeTab === "issues" &&
            (issues.length > 0 ? (
              issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 bg-white rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {issue.state === "open" && (
                          <Circle className="text-green-600" size={18} />
                        )}
                        {issue.state === "closed" && (
                          <CheckCircle2 className="text-purple-600" size={18} />
                        )}
                        <span className="font-medium text-slate-900">
                          {issue.title}
                        </span>
                        <span className="text-xs text-slate-500">
                          #{issue.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                        {issue.assignee && (
                          <>
                            <div className="flex items-center gap-1.5">
                              <img
                                src={issue.assignee.avatar}
                                alt={issue.assignee.name}
                                className="w-5 h-5 rounded-full"
                              />
                              <span>{issue.assignee.name}</span>
                            </div>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatRelativeDate(new Date(issue.date))}</span>
                        <span>•</span>
                        <span>{issue.comments} commentaires</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {issue.labels.map((label) => (
                          <span
                            key={label}
                            className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-violet-600 hover:text-violet-700 ml-4"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<AlertCircle size={20} />}
                title="Aucune issue"
                description="Tout est calme pour le moment. Ajoutez un filtre différent ou revenez plus tard."
              />
            ))}
        </div>
      </div>
    </motion.div>
  );
}
