"use client";

import { GitCommit, GitPullRequest, CircleDot, Clock } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import type { RecentActivity as RecentActivityType } from "@/query/useQueryRepo";
import { EmptyState } from "@/components/EmptyState";
import { Panel } from "@/components/app/Panel";

const ACTIVITY_ICONS = {
  commit: { icon: GitCommit, className: "bg-iris-50 text-iris-600" },
  pr: { icon: GitPullRequest, className: "bg-iris-100 text-iris-700" },
  issue: { icon: CircleDot, className: "bg-fuchsia-50 text-fuchsia-600" },
};

interface RecentActivityProps {
  recentActivity: RecentActivityType | null | undefined;
  className?: string;
}

export function RecentActivity({ recentActivity, className }: RecentActivityProps) {
  const stats = recentActivity?.stats || { commits: 0, prs: 0, issues: 0 };
  const items = recentActivity?.items || [];
  const hasActivity = stats.commits > 0 || stats.prs > 0 || stats.issues > 0;

  return (
    <Panel
      title="Activité récente"
      icon={Clock}
      className={className}
      action={
        <span className="rounded-full bg-paper px-3 py-1 text-xs text-ink/60">
          {hasActivity
            ? `48 h : ${stats.commits} commits, ${stats.prs} PR, ${stats.issues} issues`
            : "Rien depuis 48 h"}
        </span>
      }
    >
      {items.length > 0 ? (
        <ul className="-mx-2 space-y-1">
          {items.map((activity, index) => {
            const { icon: Icon, className: iconClass } = ACTIVITY_ICONS[activity.type];
            return (
              <li key={`${activity.type}-${activity.sha || activity.number || index}`}>
                <a
                  href={activity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-iris-50"
                >
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink group-hover:text-iris-700">
                      {activity.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/50">
                      <img src={activity.authorAvatar} alt="" className="size-4 rounded-full" />
                      {activity.author}
                    </p>
                  </div>
                  {activity.sha ? (
                    <span className="hidden shrink-0 font-mono text-xs text-iris-600 sm:inline">
                      {activity.sha.slice(0, 7)}
                    </span>
                  ) : activity.number ? (
                    <span className="hidden shrink-0 text-xs text-ink/45 sm:inline">
                      #{activity.number}
                    </span>
                  ) : null}
                  <span className="w-24 shrink-0 text-right text-xs text-ink/45">
                    {formatRelativeDate(new Date(activity.date))}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={<Clock size={18} />}
          title="Aucune activité récente"
          description="Les derniers commits, pull requests et issues apparaîtront ici."
        />
      )}
    </Panel>
  );
}
