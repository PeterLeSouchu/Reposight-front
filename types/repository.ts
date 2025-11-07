// Types pour les données mockées (en attente de l'API)
export interface Commit {
  sha: string;
  message: string;
  author: { name: string; login: string; avatar: string };
  date: string;
  url: string;
}

export interface PullRequest {
  id: number;
  title: string;
  state: "open" | "closed" | "merged";
  author: { name: string; avatar: string };
  reviewers: { name: string; avatar: string; approved: boolean }[];
  labels: string[];
  date: string;
  branch: string;
  baseBranch: string;
}

export interface Issue {
  id: number;
  title: string;
  state: "open" | "closed";
  assignee: { name: string; avatar: string } | null;
  labels: string[];
  comments: number;
  date: string;
}

export interface ReportHistory {
  id: number;
  name: string;
  date: string;
  size: string;
  url: string;
}

export interface Dependency {
  name: string;
  version: string;
  type: "dependencies" | "devDependencies";
  outdated: boolean;
}

export interface EngagementMetrics {
  avgIssueResponseTime: number;
  issueCloseRate: number;
  prMergeRate: number;
  contributorActivity: {
    active: number;
    occasional: number;
    inactive: number;
  };
}

export interface ContributorDisplay {
  name: string;
  avatar: string;
  commits: number;
  url: string;
  additions: number;
  deletions: number;
}

export interface ActivityDay {
  date: Date;
  commits: number;
  prs: number;
  issues: number;
}

export interface WeeklyComparison {
  commits: {
    currentWeek: number;
    lastWeek: number;
    percentage: number;
  };
  prs: {
    currentWeek: number;
    lastWeek: number;
    percentage: number;
  };
  issues: {
    currentWeek: number;
    lastWeek: number;
    percentage: number;
  };
}

export type TabType = "commits" | "pr" | "issues";
