"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useQueryRepo } from "@/query/useQueryRepo";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AppShell } from "@/components/app/AppShell";
import { RepositorySkeleton } from "@/components/repository/RepositorySkeleton";
import { RepositoryHeader } from "@/components/repository/RepositoryHeader";
import { RecentActivity } from "@/components/repository/RecentActivity";
import { ActivityChart } from "@/components/repository/ActivityChart";
import { WeeklyComparison } from "@/components/repository/WeeklyComparison";
import { ContributorsList } from "@/components/repository/ContributorsList";
import { ActivityTabs } from "@/components/repository/activity-tabs/ActivityTabs";

import type { ActivityDay, ContributorDisplay } from "@/types/repository";

export default function RepositoryPage() {
  const params = useParams<{ id: string }>();
  const repoId = Number(params.id);
  const queryClient = useQueryClient();

  const {
    data: repoApi,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQueryRepo(repoId);

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
      <AppShell>
        <ErrorMessage error={error} variant="inline" />
      </AppShell>
    );
  }

  const { info, recentActivity, weeklyComparison, contributors } = repoApi;

  const handleRefresh = () => {
    if (!Number.isFinite(repoId)) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["repo", repoId] });
  };

  // Préparation des contributeurs pour l'affichage
  const contributorsData: ContributorDisplay[] = contributors.map(
    (contributor) => ({
      name: contributor.username,
      avatar: contributor.avatar,
      commits: contributor.commits,
      url: contributor.url,
    })
  );

  return (
    <AppShell>
      <RepositoryHeader info={info} onRefresh={handleRefresh} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ActivityChart activityData={activityData} className="lg:col-span-2" />
        <WeeklyComparison comparison={weeklyComparison} />
        <RecentActivity recentActivity={recentActivity} className="lg:col-span-2" />
        <ContributorsList contributors={contributorsData} />
      </div>

      <ActivityTabs repoId={repoId} className="mt-6" />
    </AppShell>
  );
}
