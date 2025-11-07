"use client";

import { motion } from "motion/react";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import type { WeeklyComparison as WeeklyComparisonType } from "@/types/repository";
import { EmptyState } from "@/components/EmptyState";

interface WeeklyComparisonProps {
  comparison: WeeklyComparisonType;
}

export function WeeklyComparison({ comparison }: WeeklyComparisonProps) {
  const hasNoActivity =
    comparison.commits.currentWeek === 0 &&
    comparison.commits.lastWeek === 0 &&
    comparison.prs.currentWeek === 0 &&
    comparison.prs.lastWeek === 0 &&
    comparison.issues.currentWeek === 0 &&
    comparison.issues.lastWeek === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.14 }}
      className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
    >
      <div className="flex items-center gap-2 mb-4 max-[585px]:justify-center">
        <TrendingUp className="text-violet-600" size={20} />
        <h2 className="text-xl font-bold text-slate-900 text-center">
          Cette semaine vs semaine dernière
        </h2>
      </div>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
        {hasNoActivity ? (
          <div className="col-span-3">
            <EmptyState
              icon={<TrendingUp size={20} />}
              title="Pas de variation récente"
              description="Aucune différence notable entre cette semaine et la précédente."
            />
          </div>
        ) : (
          Object.entries(comparison).map(([key, value]) => (
            <div
              key={key}
              className="bg-white p-4 rounded-xl border border-violet-100"
            >
              <div className="flex items-center justify-between mb-2 max-[585px]:flex-col max-[585px]:items-center max-[585px]:gap-1">
                <span className="text-sm font-medium text-slate-700 capitalize text-center">
                  {key === "prs"
                    ? "PRs"
                    : key === "commits"
                    ? "Commits"
                    : "Issues"}
                </span>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    value.percentage > 0
                      ? "text-green-600"
                      : value.percentage < 0
                      ? "text-red-600"
                      : "text-slate-600"
                  }`}
                >
                  {value.percentage > 0 ? (
                    <ArrowUp size={14} />
                  ) : value.percentage < 0 ? (
                    <ArrowDown size={14} />
                  ) : null}
                  {Math.abs(value.percentage).toFixed(1)}%
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>
                  Cette semaine:{" "}
                  <span className="font-semibold text-slate-900">
                    {value.currentWeek}
                  </span>
                </span>
                <span>•</span>
                <span>
                  Semaine dernière:{" "}
                  <span className="font-semibold text-slate-900">
                    {value.lastWeek}
                  </span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
