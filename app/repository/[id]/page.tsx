"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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

  console.log("repoApi", repoApi);

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
          <ErrorMessage error={error} />
        </div>
      </div>
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
    <div className="relative min-h-screen text-slate-900 overflow-hidden bg-[#fafafa]">
      <BackgroundDots />

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8">
        <RepositoryHeader info={info} onRefresh={handleRefresh} />

        <RecentActivity recentActivity={recentActivity} />

        <ActivityChart activityData={activityData} />

        <WeeklyComparison comparison={weeklyComparison} />

        <ContributorsList contributors={contributorsData} />

        <ActivityTabs repoId={repoId} />
      </div>
    </div>
  );
}
