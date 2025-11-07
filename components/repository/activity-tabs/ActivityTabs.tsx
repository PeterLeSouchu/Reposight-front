"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { GitCommit, GitPullRequest, AlertCircle, Loader2 } from "lucide-react";

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
}

export function ActivityTabs({ repoId }: ActivityTabsProps) {
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
        icon: GitCommit,
        count: commitsTotal,
        isLoading: commitsBadgeLoading,
      },
      {
        id: "pr" as TabType,
        label: "Pull Requests",
        icon: GitPullRequest,
        count: pullRequestsTotal,
        isLoading: pullRequestsBadgeLoading,
      },
      {
        id: "issues" as TabType,
        label: "Issues",
        icon: AlertCircle,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-50 border border-violet-200/50 rounded-2xl shadow-lg overflow-hidden mb-6"
    >
      <div className="border-b border-violet-200/50 bg-white">
        <div className="p-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full cursor-pointer flex items-center justify-between sm:justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-violet-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {tab.isLoading ? (
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
      </div>

      <div className="p-6">
        <div className="mb-6 space-y-6">
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
    </motion.div>
  );
}
