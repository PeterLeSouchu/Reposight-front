"use client";

import { motion } from "motion/react";
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Sparkles,
  Clock,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import type { RecentActivity as RecentActivityType } from "@/query/useQueryRepo";
import { EmptyState } from "@/components/EmptyState";

interface RecentActivityProps {
  recentActivity: RecentActivityType | null | undefined;
}

function getActivityIcon(type: string) {
  switch (type) {
    case "commit":
      return <GitCommit className="text-violet-600" size={16} />;
    case "pr":
      return <GitPullRequest className="text-yellow-600" size={16} />;
    case "issue":
      return <AlertCircle className="text-red-600" size={16} />;
    default:
      return null;
  }
}

export function RecentActivity({ recentActivity }: RecentActivityProps) {
  const stats = recentActivity?.stats || {
    commits: 0,
    prs: 0,
    issues: 0,
  };
  const items = recentActivity?.items || [];
  const hasActivity = stats.commits > 0 || stats.prs > 0 || stats.issues > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="text-violet-600" size={20} />
          <h2 className="text-xl font-bold text-slate-900">Activité récente</h2>
        </div>
        <div className="flex items-center gap-2 text-sm bg-violet-100/50 text-violet-700 px-3 py-1 rounded-lg border border-violet-200/50">
          <Sparkles size={14} />
          <span>
            {hasActivity
              ? `Depuis 48h : ${stats.commits} commits, ${stats.prs} PRs, ${stats.issues} issues`
              : "Aucune activité récente"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {items && items.length > 0 ? (
          items.map((activity, index) => (
            <motion.a
              key={`${activity.type}-${
                activity.sha || activity.number || index
              }`}
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all cursor-pointer group"
            >
              <div className="mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900 group-hover:text-violet-600 transition-colors">
                    {activity.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={activity.authorAvatar}
                      alt={activity.author}
                      className="w-4 h-4 rounded-full"
                    />
                    <span>{activity.author}</span>
                  </div>
                  <span>•</span>
                  <span>{formatRelativeDate(new Date(activity.date))}</span>
                </div>
              </div>
              <div className="text-violet-600 group-hover:text-violet-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Voir →
              </div>
            </motion.a>
          ))
        ) : (
          <EmptyState
            icon={<Clock size={20} />}
            title="Aucune activité récente trouvée"
            description="Les activités les plus récentes apparaîtront ici dès qu'elles seront disponibles."
          />
        )}
      </div>
    </motion.div>
  );
}
