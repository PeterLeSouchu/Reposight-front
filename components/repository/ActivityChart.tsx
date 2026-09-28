"use client";

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
import { Panel } from "@/components/app/Panel";

const SERIES = [
  { key: "commits", label: "Commits", color: "#6523cc" },
  { key: "prs", label: "Pull requests", color: "#a98ef5" },
  { key: "issues", label: "Issues", color: "#e879f9" },
];

interface ActivityChartProps {
  activityData: ActivityDay[];
  className?: string;
}

export function ActivityChart({ activityData, className }: ActivityChartProps) {
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
    <Panel
      title="Activité sur 30 jours"
      icon={Activity}
      className={className}
      action={
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/60">
          {SERIES.map((serie) => (
            <li key={serie.key} className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-[3px]"
                style={{ backgroundColor: serie.color }}
              />
              {serie.label}
            </li>
          ))}
        </ul>
      }
    >
      <div className="flex-1">
        {activityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              barCategoryGap="8%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ece8f7"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#8a83a3", fontWeight: 500 }}
                tickFormatter={formatXAxisLabel}
                axisLine={false}
                tickLine={false}
                height={40}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#8a83a3", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                cursor={{ fill: "rgba(101, 35, 204, 0.06)" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const getLabel = (dataKey: string) => {
                      if (dataKey === "commits") return "Commits";
                      if (dataKey === "prs") return "Pull requests";
                      if (dataKey === "issues") return "Issues";
                      return dataKey;
                    };

                    return (
                      <div className="min-w-[150px] rounded-xl border border-iris-100 bg-white p-3 shadow-[0_20px_40px_-20px_rgba(42,14,87,0.35)]">
                        <p className="mb-2 text-xs font-semibold text-ink">
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
                                <span className="text-xs text-ink/60">
                                  {getLabel(entry.dataKey as string)}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-ink">
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
                  <stop offset="0%" stopColor="#7442e3" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6523cc" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="prsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b19bf6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#a98ef5" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="issuesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f0abfc" stopOpacity={1} />
                  <stop offset="100%" stopColor="#e879f9" stopOpacity={1} />
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
    </Panel>
  );
}
