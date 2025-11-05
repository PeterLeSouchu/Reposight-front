import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface RepoLastCommit {
  sha: string;
  message: string;
  author: string;
  authorAvatar: string;
  date: string;
}

export interface RepoLanguage {
  name: string;
  percentage: number;
}

export interface RepoInfo {
  name: string;
  description: string | null;
  languages: RepoLanguage[];
  isFork: boolean;
  sizeMb: number;
  contributorsCount: number;
  starsCount: number;
  lastCommit: RepoLastCommit;
  url: string;
}

export interface DailyStat {
  date: string;
  commits: number;
  prs: number;
  issues: number;
}

export interface WeeklyComparison {
  currentWeek: {
    start: string;
    end: string;
    commits: number;
    prs: number;
    issues: number;
  };
  previousWeek: {
    start: string;
    end: string;
    commits: number;
    prs: number;
    issues: number;
  };
  comparison: {
    commits: {
      change: number;
      percent: number;
    };
    prs: {
      change: number;
      percent: number;
    };
    issues: {
      change: number;
      percent: number;
    };
  };
}

export interface Contributor {
  username: string;
  commits: number;
  avatar: string;
  url: string;
}

export interface RecentActivityItem {
  type: "commit" | "pr" | "issue";
  title: string;
  author: string;
  authorAvatar: string;
  date: string;
  url: string;
  sha?: string; // Pour les commits
  number?: number; // Pour les PRs et issues
}

export interface RecentActivity {
  stats: {
    commits: number;
    prs: number;
    issues: number;
  };
  items: RecentActivityItem[];
}

export interface RepoDetailResponse {
  info: RepoInfo;
  recentActivity: RecentActivity;
  dailyStats: DailyStat[];
  weeklyComparison: WeeklyComparison;
  contributors: Contributor[];
}

export function useQueryRepo(repoId: number | null) {
  return useQuery({
    queryKey: ["repo", repoId],
    queryFn: async () => {
      if (!repoId) {
        throw new Error("repoId is required");
      }
      const response = await api.get<RepoDetailResponse>(`/repos/${repoId}`);
      return response.data;
    },
    enabled: !!repoId, // Only run query if repoId is available
  });
}
