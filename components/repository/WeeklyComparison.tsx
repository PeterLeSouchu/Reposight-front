"use client";

import { TrendingUp, ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { WeeklyComparison as WeeklyComparisonType } from "@/types/repository";
import { EmptyState } from "@/components/EmptyState";
import { Panel } from "@/components/app/Panel";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  commits: "Commits",
  prs: "Pull requests",
  issues: "Issues",
};

interface WeeklyComparisonProps {
  comparison: WeeklyComparisonType;
  className?: string;
}

export function WeeklyComparison({ comparison, className }: WeeklyComparisonProps) {
  const hasNoActivity = Object.values(comparison).every(
    (value) => value.currentWeek === 0 && value.lastWeek === 0
  );

  return (
    <Panel title="Cette semaine" icon={TrendingUp} className={className}>
      {hasNoActivity ? (
        <EmptyState
          icon={<TrendingUp size={18} />}
          title="Pas de variation récente"
          description="Aucune activité cette semaine ni la semaine dernière."
          className="flex-1"
        />
      ) : (
        <ul className="flex flex-1 flex-col divide-y divide-iris-100">
          {Object.entries(comparison).map(([key, value]) => {
            const max = Math.max(value.currentWeek, value.lastWeek, 1);
            const isUp = value.percentage > 0;
            const isDown = value.percentage < 0;
            return (
              <li key={key} className="flex flex-1 flex-col justify-center py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-ink/60">{LABELS[key] ?? key}</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                      isUp && "bg-emerald-50 text-emerald-700",
                      isDown && "bg-rose-50 text-rose-700",
                      !isUp && !isDown && "bg-iris-50 text-ink/55"
                    )}
                  >
                    {isUp ? <ArrowUp size={12} /> : isDown ? <ArrowDown size={12} /> : <Minus size={12} />}
                    {Math.abs(value.percentage).toFixed(0)} %
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-semibold text-ink">
                    {value.currentWeek}
                  </span>
                  <span className="text-xs text-ink/50">
                    contre {value.lastWeek} la semaine dernière
                  </span>
                </div>
                <div className="mt-2.5 space-y-1" aria-hidden="true">
                  <div className="h-1.5 rounded-full bg-iris-50">
                    <div
                      className="h-full rounded-full bg-iris-600"
                      style={{ width: `${(value.currentWeek / max) * 100}%` }}
                    />
                  </div>
                  <div className="h-1.5 rounded-full bg-iris-50">
                    <div
                      className="h-full rounded-full bg-iris-200"
                      style={{ width: `${(value.lastWeek / max) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
