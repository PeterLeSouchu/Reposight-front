"use client";

import { motion } from "motion/react";
import { useState } from "react";
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
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import type { Commit, PullRequest, Issue, TabType } from "@/types/repository";
import { useQueryCommitsMetadata } from "@/query/useQueryCommitsMetadata";
import { useQueryCommits } from "@/query/useQueryCommits";
import { Skeleton } from "@/components/ui/skeleton";
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
  avgCommitsPerDay: number;
  contributorsCount: number;
  repoId: number;
}

export function ActivityTabs({
  repoId,
  pullRequests,
  issues,
  avgCommitsPerDay,
  contributorsCount,
}: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("commits");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const perPage = 10;

  const {
    data: commitsMetadata,
    isLoading: isLoadingCommitsMetadata,
    error: errorCommitsMetadata,
  } = useQueryCommitsMetadata(repoId);

  const {
    data: commitsData,
    isLoading: isLoadingCommits,
    error: errorCommits,
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

  const tabs = [
    {
      id: "commits" as TabType,
      label: "Commits",
      icon: GitCommit,
      count: totalCommits,
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
                  {tab.count}
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
                      <span className="truncate max-w-[160px]">{branch}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <div className="text-center py-8 text-red-500">
                <p>Erreur lors du chargement des commits</p>
              </div>
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
                  <div className="flex items-center justify-between pt-4 border-t border-violet-200/50">
                    <div className="text-sm text-slate-600">
                      Page {page} sur {totalPages} ({totalCommits} commits)
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft size={16} />
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                      >
                        Suivant
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Aucun commit disponible</p>
              </div>
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
              <div className="text-center py-8 text-slate-500">
                <p>Aucune pull request disponible</p>
              </div>
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
              <div className="text-center py-8 text-slate-500">
                <p>Aucune issue disponible</p>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
