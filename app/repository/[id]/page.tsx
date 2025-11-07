"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { useParams } from "next/navigation";

import { useQueryRepo } from "@/query/useQueryRepo";
import { ErrorMessage } from "@/components/ErrorMessage";
import { BackgroundDots } from "@/components/BackgroundDots";
import { RepositorySkeleton } from "@/components/repository/RepositorySkeleton";
import { RepositoryHeader } from "@/components/repository/RepositoryHeader";
import { RecentActivity } from "@/components/repository/RecentActivity";
import { ActivityChart } from "@/components/repository/ActivityChart";
import { WeeklyComparison } from "@/components/repository/WeeklyComparison";
import { ContributorsList } from "@/components/repository/ContributorsList";
import { ActivityTabs } from "@/components/repository/activity-tabs/ActivityTabs";
import { ReportHistory } from "@/components/repository/ReportHistory";
import type {
  ActivityDay,
  ContributorDisplay,
  ReportHistory as ReportHistoryType,
} from "@/types/repository";

export default function RepositoryPage() {
  const params = useParams<{ id: string }>();
  const repoId = Number(params.id);

  const {
    data: repoApi,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQueryRepo(repoId);

  console.log("repoApi", repoApi);

  // Données pour le graphique d'activité (30 derniers jours)
  // Doit être avant le retour conditionnel pour respecter les règles des hooks
  const activityData = useMemo<ActivityDay[]>(() => {
    if (!repoApi?.dailyStats) {
      return [];
    }
    return repoApi.dailyStats.map((day) => ({
      date: new Date(day.date),
      commits: day.commits,
      prs: day.prs,
      issues: day.issues,
    }));
  }, [repoApi?.dailyStats]);

  if (isLoading || isFetching) {
    return <RepositorySkeleton />;
  }

  if (error || !repoApi) {
    return (
      <div className="relative min-h-screen  overflow-hidden bg-[#fafafa]">
        <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8">
          <ErrorMessage error={error} onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  const { info, recentActivity, dailyStats, weeklyComparison, contributors } =
    repoApi;

  // Calcul des métriques pour les 30 derniers jours
  const totalCommits30d = dailyStats.reduce((sum, day) => sum + day.commits, 0);
  const avgCommitsPerDay =
    dailyStats.length > 0 ? totalCommits30d / dailyStats.length : 0;

  // Préparation des contributeurs pour l'affichage
  const contributorsData: ContributorDisplay[] = contributors.map(
    (contributor) => ({
      name: contributor.username,
      avatar: contributor.avatar,
      commits: contributor.commits,
      url: contributor.url,
      additions: 0, // Pas disponible dans l'API
      deletions: 0, // Pas disponible dans l'API
    })
  );

  // Historique des rapports PDF (mocké pour l'instant)
  const reportHistory: ReportHistoryType[] = [];

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden bg-[#fafafa]">
      <BackgroundDots />

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8">
        <RepositoryHeader info={info} onRefresh={() => refetch()} />

        <RecentActivity recentActivity={recentActivity} />

        <ActivityChart activityData={activityData} />

        <WeeklyComparison comparison={weeklyComparison} />

        <ContributorsList contributors={contributorsData} />

        <ActivityTabs repoId={repoId} />

        <ReportHistory reports={reportHistory} />
      </div>
    </div>
  );
}
