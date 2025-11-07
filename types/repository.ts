// Types pour les données mockées (en attente de l'API)
export interface Commit {
  sha: string;
  message: string;
  author: { name: string; login: string; avatar: string };
  date: string;
  url: string;
}

export interface PullRequest {
  number: number;
  title: string;
  state: "open" | "closed" | "merged";
  author: { login: string; avatar: string };
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  mergedAt: string | null;
  url: string;
}

export interface Issue {
  number: number;
  title: string;
  state: "open" | "closed";
  author: { login: string; avatar: string };
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  comments: number;
  labels: string[];
  url: string;
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
