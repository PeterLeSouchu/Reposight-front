"use client";

import { motion } from "motion/react";
import { Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ActivityDay } from "@/types/repository";
import { EmptyState } from "@/components/EmptyState";

interface ActivityChartProps {
  activityData: ActivityDay[];
}

export function ActivityChart({ activityData }: ActivityChartProps) {
  const chartData = activityData.map((day) => ({
    date: `${day.date.getDate()}/${day.date.getMonth() + 1}`,
    fullDate: day.date,
    commits: day.commits,
    prs: day.prs,
    issues: day.issues,
  }));

  // Afficher seulement une date sur 5 pour éviter la surcharge
  const formatXAxisLabel = (tickItem: string, index: number) => {
    if (index % 5 === 0) {
      return tickItem;
    }
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12 }}
      className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="text-violet-600" size={20} />
          <h2 className="text-xl font-bold text-slate-900">
            Activité sur 30 jours
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span>Commits</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span>PRs</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>Issues</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-violet-100">
        {activityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              barCategoryGap="8%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                tickFormatter={formatXAxisLabel}
                axisLine={false}
                tickLine={false}
                height={40}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                cursor={{ fill: "rgba(139, 92, 246, 0.05)" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const getLabel = (dataKey: string) => {
                      if (dataKey === "commits") return "Commits";
                      if (dataKey === "prs") return "PRs";
                      if (dataKey === "issues") return "Issues";
                      return dataKey;
                    };

                    return (
                      <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3 min-w-[140px]">
                        <p className="text-xs font-semibold text-slate-900 mb-2">
                          {label}
                        </p>
                        <div className="space-y-1.5">
                          {payload.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-xs text-slate-600">
                                  {getLabel(entry.dataKey as string)}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-slate-900">
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="commits"
                stackId="a"
                fill="url(#commitsGradient)"
                name="Commits"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="prs"
                stackId="a"
                fill="url(#prsGradient)"
                name="PRs"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="issues"
                stackId="a"
                fill="url(#issuesGradient)"
                name="Issues"
                radius={[6, 6, 0, 0]}
              />
              <defs>
                <linearGradient
                  id="commitsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="prsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                  <stop offset="100%" stopColor="#eab308" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="issuesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            icon={<Activity size={20} />}
            title="Aucune activité enregistrée"
            description="Aucune contribution n'a été détectée sur les 30 derniers jours."
          />
        )}
      </div>
    </motion.div>
  );
}
