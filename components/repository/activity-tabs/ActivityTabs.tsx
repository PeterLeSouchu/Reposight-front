"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { GitCommit, GitPullRequest, CircleDot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import type { TabType } from "@/types/repository";
import { CommitTabContent } from "./CommitTabContent";
import { PullRequestsTabContent } from "./PullRequestsTabContent";
import { IssueTabContent } from "./IssueTabContent";
import { useQueryCommits } from "@/query/useQueryCommits";
import { useQueryPullRequests } from "@/query/useQueryPullRequests";
import { useQueryIssues } from "@/query/useQueryIssues";

export interface CommitFilters {
  author: string;
  branch: string;
  page: number;
  perPage: number;
}

export interface PullRequestFilters {
  author: string;
  state: string;
  page: number;
  perPage: number;
}

export interface IssueFilters {
  author: string;
  state: string;
  page: number;
  perPage: number;
}

interface ActivityTabsProps {
  repoId: number;
  className?: string;
}

export function ActivityTabs({ repoId, className }: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("commits");
  const [commitsFilters, setCommitsFilters] = useState<CommitFilters>({
    author: "all",
    branch: "all",
    page: 1,
    perPage: 10,
  });
  const [pullRequestsFilters, setPullRequestsFilters] =
    useState<PullRequestFilters>({
      author: "all",
      state: "all",
      page: 1,
      perPage: 5,
    });
  const [issuesFilters, setIssuesFilters] = useState<IssueFilters>({
    author: "all",
    state: "all",
    page: 1,
    perPage: 5,
  });

  const commitsQuery = useQueryCommits(repoId, {
    page: commitsFilters.page,
    perPage: commitsFilters.perPage,
    author: commitsFilters.author !== "all" ? commitsFilters.author : undefined,
    branch: commitsFilters.branch !== "all" ? commitsFilters.branch : undefined,
  });

  const pullRequestsQuery = useQueryPullRequests(repoId, {
    page: pullRequestsFilters.page,
    perPage: pullRequestsFilters.perPage,
    author:
      pullRequestsFilters.author !== "all"
        ? pullRequestsFilters.author
        : undefined,
    state:
      pullRequestsFilters.state !== "all"
        ? pullRequestsFilters.state
        : undefined,
  });

  const issuesQuery = useQueryIssues(repoId, {
    page: issuesFilters.page,
    perPage: issuesFilters.perPage,
    author: issuesFilters.author !== "all" ? issuesFilters.author : undefined,
    state: issuesFilters.state !== "all" ? issuesFilters.state : undefined,
  });

  const commitsTotal = commitsQuery.data?.pagination?.total ?? 0;
  const pullRequestsTotal = pullRequestsQuery.data?.pagination?.total ?? 0;
  const issuesTotal = issuesQuery.data?.pagination?.total ?? 0;

  const commitsBadgeLoading = commitsQuery.isFetching;
  const pullRequestsBadgeLoading = pullRequestsQuery.isFetching;
  const issuesBadgeLoading = issuesQuery.isFetching;

  const updateCommitFilters = (update: Partial<CommitFilters>) => {
    setCommitsFilters((prev) => ({ ...prev, ...update }));
  };

  const updatePullRequestsFilters = (update: Partial<PullRequestFilters>) => {
    setPullRequestsFilters((prev) => ({ ...prev, ...update }));
  };

  const updateIssuesFilters = (update: Partial<IssueFilters>) => {
    setIssuesFilters((prev) => ({ ...prev, ...update }));
  };

  const tabs = useMemo(
    () => [
      {
        id: "commits" as TabType,
        label: "Commits",
        shortLabel: "Commits",
        icon: GitCommit,
        count: commitsTotal,
        isLoading: commitsBadgeLoading,
      },
      {
        id: "pr" as TabType,
        label: "Pull requests",
        shortLabel: "PR",
        icon: GitPullRequest,
        count: pullRequestsTotal,
        isLoading: pullRequestsBadgeLoading,
      },
      {
        id: "issues" as TabType,
        label: "Issues",
        shortLabel: "Issues",
        icon: CircleDot,
        count: issuesTotal,
        isLoading: issuesBadgeLoading,
      },
    ],
    [
      commitsTotal,
      commitsBadgeLoading,
      pullRequestsTotal,
      pullRequestsBadgeLoading,
      issuesTotal,
      issuesBadgeLoading,
    ]
  );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-iris-100 bg-white shadow-[0_1px_2px_rgba(42,14,87,0.04)]",
        className
      )}
    >
      <div className="border-b border-iris-100 bg-paper/60 p-2">
        <div role="tablist" className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl px-2 py-2.5 sm:px-4 text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-ink/60 hover:bg-white hover:text-ink"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activity-tab-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="absolute inset-0 rounded-xl bg-iris-600 shadow-[0_8px_20px_-8px_rgba(101,35,204,0.7)]"
                  />
                )}
                <span className="relative flex items-center gap-1.5 sm:gap-2">
                  <Icon size={16} />
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span
                    className={cn(
                      "flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-xs",
                      isActive ? "bg-white/20 text-white" : "bg-iris-100 text-iris-700"
                    )}
                  >
                    {tab.isLoading ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      tab.count
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div>
          <div className={activeTab === "commits" ? "block" : "hidden"}>
            <CommitTabContent
              repoId={repoId}
              filters={commitsFilters}
              onFiltersChange={updateCommitFilters}
              commits={commitsQuery.data}
              commitsLoading={commitsQuery.isLoading}
              commitsFetching={commitsQuery.isFetching}
              commitsError={commitsQuery.error}
            />
          </div>

          <div className={activeTab === "pr" ? "block" : "hidden"}>
            <PullRequestsTabContent
              repoId={repoId}
              filters={pullRequestsFilters}
              onFiltersChange={updatePullRequestsFilters}
              pullRequests={pullRequestsQuery.data}
              pullRequestsLoading={pullRequestsQuery.isLoading}
              pullRequestsFetching={pullRequestsQuery.isFetching}
              pullRequestsError={pullRequestsQuery.error}
            />
          </div>

          <div className={activeTab === "issues" ? "block" : "hidden"}>
            <IssueTabContent
              repoId={repoId}
              filters={issuesFilters}
              onFiltersChange={updateIssuesFilters}
              issues={issuesQuery.data}
              issuesLoading={issuesQuery.isLoading}
              issuesFetching={issuesQuery.isFetching}
              issuesError={issuesQuery.error}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
