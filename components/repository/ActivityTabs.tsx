"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Circle,
  ExternalLink,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import type { Commit, PullRequest, Issue, TabType } from "@/types/repository";

interface ActivityTabsProps {
  commits: Commit[];
  pullRequests: PullRequest[];
  issues: Issue[];
  avgCommitsPerDay: number;
  contributorsCount: number;
}

export function ActivityTabs({
  commits,
  pullRequests,
  issues,
  avgCommitsPerDay,
  contributorsCount,
}: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("commits");

  const tabs = [
    {
      id: "commits" as TabType,
      label: "Commits",
      icon: GitCommit,
      count: commits.length,
    },
    {
      id: "pr" as TabType,
      label: "Pull Requests",
      icon: GitPullRequest,
      count: pullRequests.length,
    },
    {
      id: "issues" as TabType,
      label: "Issues",
      icon: AlertCircle,
      count: issues.length,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-50 border border-violet-200/50 rounded-2xl shadow-lg overflow-hidden mb-6"
    >
      {/* Tabs */}
      <div className="border-b border-violet-200/50 bg-white">
        <div className="flex gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/50 rounded-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="text-violet-600 mt-0.5" size={18} />
            <div className="flex-1">
              <p className="text-sm text-slate-700">
                {activeTab === "commits" &&
                  "Analyse IA : Catégorisation automatique détectée (fix: 40%, feat: 35%, refactor: 25%). Aucune anomalie détectée."}
                {activeTab === "pr" &&
                  "Résumé IA : Temps moyen avant merge : 2.3 jours. 1 PR ouverte nécessite attention. Risque de conflit faible."}
                {activeTab === "issues" &&
                  "Insight IA : 2 issues ouvertes, 1 stale (>7 jours). Suggestion : assigner un label 'priority' aux issues critiques."}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>

          {activeTab === "commits" && (
            <>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les auteurs</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Toutes les branches</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>30 derniers jours</option>
              </select>
            </>
          )}

          {activeTab === "pr" && (
            <>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les états</option>
                <option>Ouvert</option>
                <option>Fermé</option>
                <option>Fusionné</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les labels</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les auteurs</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Toutes les branches</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>30 derniers jours</option>
              </select>
            </>
          )}

          {activeTab === "issues" && (
            <>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les états</option>
                <option>Ouvert</option>
                <option>Fermé</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les labels</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les assignés</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>30 derniers jours</option>
              </select>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-violet-100">
            <div className="text-sm text-slate-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-slate-900">
              {activeTab === "commits" && commits.length}
              {activeTab === "pr" && pullRequests.length}
              {activeTab === "issues" && issues.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-violet-100">
            <div className="text-sm text-slate-600 mb-1">Ouverts</div>
            <div className="text-2xl font-bold text-blue-600">
              {activeTab === "commits" && "-"}
              {activeTab === "pr" &&
                pullRequests.filter((pr) => pr.state === "open").length}
              {activeTab === "issues" &&
                issues.filter((i) => i.state === "open").length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-violet-100">
            <div className="text-sm text-slate-600 mb-1">Moyenne/jour</div>
            <div className="text-2xl font-bold text-violet-600">
              {activeTab === "commits" && avgCommitsPerDay.toFixed(1)}
              {activeTab === "pr" && (pullRequests.length / 30).toFixed(1)}
              {activeTab === "issues" && (issues.length / 30).toFixed(1)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-violet-100">
            <div className="text-sm text-slate-600 mb-1">
              {activeTab === "commits" && "Contributeurs actifs"}
              {activeTab === "pr" && "Taux de merge"}
              {activeTab === "issues" && "Taux de résolution"}
            </div>
            <div className="text-lg font-bold text-slate-900">
              {activeTab === "commits" && contributorsCount}
              {activeTab === "pr" && "85.2%"}
              {activeTab === "issues" && "78.5%"}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {activeTab === "commits" &&
            (commits.length > 0 ? (
              commits.map((commit) => (
                <div
                  key={commit.id}
                  className="p-4 bg-white rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            commit.type === "fix"
                              ? "bg-red-100 text-red-700"
                              : commit.type === "feat"
                              ? "bg-green-100 text-green-700"
                              : commit.type === "refactor"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {commit.type}
                        </span>
                        <span className="font-medium text-slate-900">
                          {commit.message}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={commit.author.avatar}
                            alt={commit.author.name}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{commit.author.name}</span>
                        </div>
                        <span>•</span>
                        <span>{commit.branch}</span>
                        <span>•</span>
                        <span>{formatRelativeDate(new Date(commit.date))}</span>
                        <span>•</span>
                        <span className="font-mono text-xs">
                          {commit.sha.substring(0, 7)}
                        </span>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-violet-600 hover:text-violet-700 ml-4"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Aucun commit disponible</p>
              </div>
            ))}

          {activeTab === "pr" &&
            (pullRequests.length > 0 ? (
              pullRequests.map((pr) => (
                <div
                  key={pr.id}
                  className="p-4 bg-white rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {pr.state === "merged" && (
                          <CheckCircle2 className="text-green-600" size={18} />
                        )}
                        {pr.state === "open" && (
                          <Circle className="text-blue-600" size={18} />
                        )}
                        {pr.state === "closed" && (
                          <XCircle className="text-red-600" size={18} />
                        )}
                        <span className="font-medium text-slate-900">
                          {pr.title}
                        </span>
                        <span className="text-xs text-slate-500">#{pr.id}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={pr.author.avatar}
                            alt={pr.author.name}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{pr.author.name}</span>
                        </div>
                        <span>•</span>
                        <span>
                          {pr.branch} → {pr.baseBranch}
                        </span>
                        <span>•</span>
                        <span>{formatRelativeDate(new Date(pr.date))}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {pr.labels.map((label) => (
                          <span
                            key={label}
                            className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded"
                          >
                            {label}
                          </span>
                        ))}
                        {pr.reviewers.length > 0 && (
                          <div className="flex items-center gap-1 ml-2">
                            {pr.reviewers.map((reviewer, idx) => (
                              <img
                                key={idx}
                                src={reviewer.avatar}
                                alt={reviewer.name}
                                className={`w-5 h-5 rounded-full border-2 ${
                                  reviewer.approved
                                    ? "border-green-500"
                                    : "border-slate-300"
                                }`}
                                title={reviewer.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-violet-600 hover:text-violet-700 ml-4"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Aucune pull request disponible</p>
              </div>
            ))}

          {activeTab === "issues" &&
            (issues.length > 0 ? (
              issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 bg-white rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {issue.state === "open" && (
                          <Circle className="text-green-600" size={18} />
                        )}
                        {issue.state === "closed" && (
                          <CheckCircle2 className="text-purple-600" size={18} />
                        )}
                        <span className="font-medium text-slate-900">
                          {issue.title}
                        </span>
                        <span className="text-xs text-slate-500">
                          #{issue.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                        {issue.assignee && (
                          <>
                            <div className="flex items-center gap-1.5">
                              <img
                                src={issue.assignee.avatar}
                                alt={issue.assignee.name}
                                className="w-5 h-5 rounded-full"
                              />
                              <span>{issue.assignee.name}</span>
                            </div>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatRelativeDate(new Date(issue.date))}</span>
                        <span>•</span>
                        <span>{issue.comments} commentaires</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {issue.labels.map((label) => (
                          <span
                            key={label}
                            className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-violet-600 hover:text-violet-700 ml-4"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Aucune issue disponible</p>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
