"use client";

import { motion } from "motion/react";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Clock,
  Lock,
  Globe,
  Star,
  GitFork,
  Eye,
  Users,
  RefreshCw,
  FileDown,
  Download,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  TrendingUp,
  Sparkles,
  BarChart3,
  Settings,
  Calendar,
  User,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Circle,
  ArrowUp,
  ArrowDown,
  Code,
  FileText,
  Shield,
  Zap,
  Activity,
  Bell,
  Package,
  GitMerge,
  TrendingDown,
  AlertTriangle,
  Info,
  PlayCircle,
  Timer,
  Target,
  MessageSquare,
  Trash2,
  HardDrive,
  Scale,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Repo } from "@/types/repo";
import { formatRelativeDate, getLanguageColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQueryRepo, type RepoDetailResponse } from "@/query/useQueryRepo";

// Types pour les données mockées
interface Commit {
  id: string;
  message: string;
  author: { name: string; avatar: string; email: string };
  date: string;
  branch: string;
  sha: string;
  type: "fix" | "feat" | "refactor" | "docs" | "chore";
}

interface PullRequest {
  id: number;
  title: string;
  state: "open" | "closed" | "merged";
  author: { name: string; avatar: string };
  reviewers: { name: string; avatar: string; approved: boolean }[];
  labels: string[];
  date: string;
  branch: string;
  baseBranch: string;
}

interface Issue {
  id: number;
  title: string;
  state: "open" | "closed";
  assignee: { name: string; avatar: string } | null;
  labels: string[];
  comments: number;
  date: string;
}

interface ActivityEvent {
  type: "commit" | "pr" | "issue";
  id: string;
  title: string;
  author: { name: string; avatar: string };
  date: string;
  status: string;
  link: string;
}

export default function RepositoryPage() {
  const router = useRouter();
  const params = useParams();
  const repoId = params?.id ? parseInt(params.id as string, 10) : null;
  const [activeTab, setActiveTab] = useState<"commits" | "pr" | "issues">(
    "commits"
  );

  const { data: repoApi, isLoading, error, refetch } = useQueryRepo(repoId);

  // Données pour le graphique d'activité (30 derniers jours)
  // Utilisation des données réelles de l'API au lieu de générer avec Math.random
  // Doit être avant le retour conditionnel pour respecter les règles des hooks
  const activityData = useMemo(() => {
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

  // Si pas de données, utiliser des valeurs par défaut
  if (!repoApi) {
    return (
      <div className="relative min-h-screen text-slate-900 overflow-hidden bg-[#fafafa]">
        <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8">
          <div className="text-center py-16">
            <p className="text-slate-600">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  // Extraction des données de l'API
  const { info, recentActivity, dailyStats, weeklyComparison, contributors } =
    repoApi;

  // Calcul des métriques
  const totalCommits = dailyStats.reduce((sum, day) => sum + day.commits, 0);
  const totalPRs = dailyStats.reduce((sum, day) => sum + day.prs, 0);
  const totalIssues = dailyStats.reduce((sum, day) => sum + day.issues, 0);
  const avgCommitsPerDay =
    dailyStats.length > 0 ? totalCommits / dailyStats.length : 0;

  // Préparation des langages avec leurs couleurs
  const languages = info.languages.map((lang) => ({
    name: lang.name,
    percentage: lang.percentage,
    color: getLanguageColor(lang.name),
  }));

  // Préparation des stats
  const stats = {
    stars: info.starsCount,
    forks: 0, // Pas disponible dans l'API
    watchers: 0, // Pas disponible dans l'API
    contributors: info.contributorsCount,
    size: info.sizeMb,
    license: null, // Pas disponible dans l'API
  };

  // Préparation du dernier commit
  const lastCommit = info.lastCommit
    ? {
        sha: info.lastCommit.sha,
        message: info.lastCommit.message,
        author: {
          name: info.lastCommit.author,
          avatar: info.lastCommit.authorAvatar,
        },
        date: info.lastCommit.date,
      }
    : null;

  // Calcul de la comparaison semaine
  const comparison = {
    commits: {
      current: weeklyComparison.currentWeek.commits,
      previous: weeklyComparison.previousWeek.commits,
      change: weeklyComparison.comparison.commits.percent,
    },
    prs: {
      current: weeklyComparison.currentWeek.prs,
      previous: weeklyComparison.previousWeek.prs,
      change: weeklyComparison.comparison.prs.percent,
    },
    issues: {
      current: weeklyComparison.currentWeek.issues,
      previous: weeklyComparison.previousWeek.issues,
      change: weeklyComparison.comparison.issues.percent,
    },
    contributors: {
      current: contributors.length,
      previous: contributors.length, // Pas de comparaison disponible
      change: 0,
    },
  };

  // Préparation des contributeurs pour l'affichage
  const contributorsData = contributors.map((contributor) => ({
    name: contributor.username,
    avatar: contributor.avatar,
    commits: contributor.commits,
    additions: 0, // Pas disponible dans l'API
    deletions: 0, // Pas disponible dans l'API
  }));

  // Données mockées pour les onglets (pas encore disponibles dans l'API)
  const commits: Commit[] = [];
  const pullRequests: PullRequest[] = [];
  const issues: Issue[] = [];

  // Historique des rapports PDF (mocké pour l'instant)
  const reportHistory: Array<{
    id: number;
    name: string;
    date: string;
    size: string;
    url: string;
  }> = [];

  // Données mockées pour dépendances et autres sections
  const dependencies = [
    {
      name: "react",
      version: "^18.2.0",
      type: "dependencies" as const,
      outdated: false,
    },
    {
      name: "typescript",
      version: "^5.0.0",
      type: "dependencies" as const,
      outdated: false,
    },
    {
      name: "axios",
      version: "^1.3.0",
      type: "dependencies" as const,
      outdated: true,
    },
    {
      name: "@tanstack/react-query",
      version: "^4.29.0",
      type: "dependencies" as const,
      outdated: true,
    },
    {
      name: "tailwindcss",
      version: "^3.3.0",
      type: "devDependencies" as const,
      outdated: false,
    },
  ];

  // Métriques d'engagement (mockées pour l'instant)
  const engagementMetrics = {
    avgIssueResponseTime: 4.2, // heures
    issueCloseRate: 78.5, // %
    prMergeRate: 85.2, // %
    contributorActivity: {
      active: 8,
      occasional: 4,
      inactive: 2,
    },
  };

  const handleBack = () => {
    router.push("/repositories");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "commit":
        return <GitCommit className="text-violet-600" size={16} />;
      case "pr":
        return <GitPullRequest className="text-blue-600" size={16} />;
      case "issue":
        return <AlertCircle className="text-orange-600" size={16} />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "merged":
      case "closed":
        return <CheckCircle2 className="text-green-600" size={14} />;
      case "open":
        return <Circle className="text-blue-600" size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden bg-[#fafafa]">
      {/* Background animé */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/2 w-[1400px] h-[1400px] bg-indigo-600/20 rounded-full blur-[350px] -translate-x-1/2 will-change-[opacity,transform]"
          animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.12, 1] }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
            type: "tween",
          }}
          style={{ transformOrigin: "center center" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[900px] h-[900px] bg-purple-500/15 rounded-full blur-[280px] will-change-[opacity,transform]"
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
            delay: 2,
            type: "tween",
          }}
          style={{ transformOrigin: "center center" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-indigo-400/12 rounded-full blur-[220px] will-change-[opacity,transform]"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.08, 1] }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
            delay: 4,
            type: "tween",
          }}
          style={{ transformOrigin: "center center" }}
        />
      </div>

      <div className="absolute inset-0 z-0 dot-pattern" />

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8">
        {/* Bouton retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Retour aux repositories</span>
        </motion.button>

        {/* 1️⃣ Header du dépôt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200/50 rounded-2xl p-6 sm:p-8 shadow-lg mb-6 relative overflow-hidden"
        >
          {/* Glow animé */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl"
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <GitBranch className="text-white" size={20} />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {info.name}
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                      {info.description || "Aucune description"}
                    </p>
                  </div>
                </div>

                {/* Langages */}
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  {languages.slice(0, 3).map((lang, index) => (
                    <div
                      key={`${lang.name}-${index}`}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      ></span>
                      <span className="text-sm text-slate-600 font-medium">
                        {lang.name} {lang.percentage.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stats globales */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Star className="text-yellow-500" size={16} />
                    <span className="text-sm font-medium">{stats.stars}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <GitFork className="text-slate-500" size={16} />
                    <span className="text-sm font-medium">{stats.forks}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Eye className="text-slate-500" size={16} />
                    <span className="text-sm font-medium">
                      {stats.watchers}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="text-violet-600" size={16} />
                    <span className="text-sm font-medium">
                      {stats.contributors}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <HardDrive className="text-slate-500" size={16} />
                    <span className="text-sm font-medium">{stats.size} Mo</span>
                  </div>
                  {stats.license && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Scale className="text-slate-500" size={16} />
                      <span className="text-sm font-medium">
                        {stats.license}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dernier commit */}
                {lastCommit && (
                  <div className="mt-4 flex items-center gap-3 text-sm">
                    <GitCommit className="text-violet-600" size={16} />
                    <span className="text-slate-600">
                      <span className="font-medium">
                        {lastCommit.author.name}
                      </span>{" "}
                      • {lastCommit.message} •{" "}
                      {formatRelativeDate(new Date(lastCommit.date))}
                    </span>
                  </div>
                )}

                {/* Résumé IA */}
                {comparison.commits.change !== 0 ||
                comparison.prs.change !== 0 ||
                comparison.issues.change !== 0 ? (
                  <div className="mt-4 flex items-center gap-2 text-sm bg-violet-100/50 text-violet-700 px-3 py-2 rounded-lg border border-violet-200/50">
                    <Sparkles className="text-violet-600" size={14} />
                    <span>
                      {comparison.commits.change > 0
                        ? `Commits en hausse de +${Math.abs(
                            comparison.commits.change
                          ).toFixed(1)}% cette semaine`
                        : comparison.commits.change < 0
                        ? `Commits en baisse de ${Math.abs(
                            comparison.commits.change
                          ).toFixed(1)}% cette semaine`
                        : "Activité stable cette semaine"}
                    </span>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-sm bg-slate-100/50 text-slate-600 px-3 py-2 rounded-lg border border-slate-200/50">
                    <Sparkles className="text-slate-500" size={14} />
                    <span>Aucune activité cette semaine</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <Button
                  variant="outline"
                  className="bg-white border-violet-200 hover:bg-violet-50 text-violet-700"
                  onClick={() => refetch()}
                >
                  <RefreshCw size={16} />
                  Actualiser
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border-violet-200 hover:bg-violet-50 text-violet-700"
                >
                  <FileDown size={16} />
                  Exporter rapport
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border-violet-200 hover:bg-violet-50 text-violet-700"
                >
                  <RefreshCw size={16} />
                  Actualiser
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border-red-200 hover:bg-red-50 text-red-700"
                >
                  <Trash2 size={16} />
                  Supprimer le repo
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 📋 Activité récente (Timeline) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Activité récente
            </h2>
            <div className="flex items-center gap-2 text-sm bg-violet-100/50 text-violet-700 px-3 py-1 rounded-lg border border-violet-200/50">
              <Sparkles size={14} />
              <span>
                {totalCommits > 0 || totalPRs > 0 || totalIssues > 0
                  ? `Depuis 24h : ${totalCommits} commits, ${totalPRs} PRs, ${totalIssues} issues`
                  : "Aucune activité récente"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id || index}
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
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={activity.author.avatar}
                          alt={activity.author.name}
                          className="w-4 h-4 rounded-full"
                        />
                        <span>{activity.author.name}</span>
                      </div>
                      <span>•</span>
                      <span>{formatRelativeDate(new Date(activity.date))}</span>
                    </div>
                  </div>
                  <a
                    href={activity.link}
                    className="text-violet-600 hover:text-violet-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Voir →
                  </a>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Aucune activité récente pour le moment</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 📈 Graphique d'activité sur 30 jours */}
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
              <div className="px-2 py-1 bg-violet-100 rounded text-violet-700">
                {avgCommitsPerDay.toFixed(1)} commits/jour
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-violet-500"></div>
                  <span>Commits</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-500"></div>
                  <span>PRs</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-orange-500"></div>
                  <span>Issues</span>
                </div>
              </div>
            </div>
          </div>
          {/* Graphique simple avec barres */}
          <div className="bg-white p-4 rounded-xl border border-violet-100">
            {activityData.length > 0 ? (
              <div className="flex items-end justify-between gap-1 h-32">
                {activityData.map((day, index) => {
                  const maxValue = Math.max(
                    1,
                    ...activityData.map((d) => d.commits + d.prs + d.issues)
                  );
                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full flex flex-col-reverse gap-0.5 items-end"
                        style={{ height: "100px" }}
                      >
                        <div
                          className="w-full bg-violet-500 rounded-t"
                          style={{
                            height: `${(day.commits / maxValue) * 100}%`,
                            minHeight: day.commits > 0 ? "2px" : "0",
                          }}
                          title={`${day.commits} commits`}
                        ></div>
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{
                            height: `${(day.prs / maxValue) * 100}%`,
                            minHeight: day.prs > 0 ? "2px" : "0",
                          }}
                          title={`${day.prs} PRs`}
                        ></div>
                        <div
                          className="w-full bg-orange-500 rounded-t"
                          style={{
                            height: `${(day.issues / maxValue) * 100}%`,
                            minHeight: day.issues > 0 ? "2px" : "0",
                          }}
                          title={`${day.issues} issues`}
                        ></div>
                      </div>
                      {index % 5 === 0 && (
                        <span className="text-[10px] text-slate-400 mt-1">
                          {day.date.getDate()}/{day.date.getMonth() + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Aucune activité sur les 30 derniers jours</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 📊 Comparaison semaine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-violet-600" size={20} />
            <h2 className="text-xl font-bold text-slate-900">
              Cette semaine vs dernière
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {totalCommits === 0 && totalPRs === 0 && totalIssues === 0 ? (
              <div className="col-span-3 text-center py-8 text-slate-500">
                <p>Aucune activité cette semaine ou la semaine dernière</p>
              </div>
            ) : (
              Object.entries(comparison).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white p-4 rounded-xl border border-violet-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {key}
                    </span>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        value.change > 0
                          ? "text-green-600"
                          : value.change < 0
                          ? "text-red-600"
                          : "text-slate-600"
                      }`}
                    >
                      {value.change > 0 ? (
                        <ArrowUp size={14} />
                      ) : value.change < 0 ? (
                        <ArrowDown size={14} />
                      ) : null}
                      {Math.abs(value.change).toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>
                      Cette semaine:{" "}
                      <span className="font-semibold text-slate-900">
                        {value.current}
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      Semaine dernière:{" "}
                      <span className="font-semibold text-slate-900">
                        {value.previous}
                      </span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* 👥 Top contributeurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="text-violet-600" size={20} />
              <h2 className="text-xl font-bold text-slate-900">
                Top contributeurs
              </h2>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              Voir tout
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {contributorsData.length > 0 ? (
              contributorsData.map((contributor, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">
                        {contributor.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {contributor.commits} commits
                      </div>
                    </div>
                  </div>
                  {contributor.additions > 0 ||
                    (contributor.deletions > 0 && (
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <ArrowUp className="text-green-600" size={12} />
                          <span className="font-medium text-green-600">
                            {contributor.additions.toLocaleString("en-US")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ArrowDown className="text-red-600" size={12} />
                          <span className="font-medium text-red-600">
                            {contributor.deletions.toLocaleString("en-US")}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-slate-500">
                <p>Aucun contributeur disponible</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 3️⃣ Activité détaillée (Onglets) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl shadow-lg overflow-hidden mb-6"
        >
          {/* Tabs */}
          <div className="border-b border-violet-200/50 bg-white">
            <div className="flex gap-1 p-2">
              {[
                {
                  id: "commits",
                  label: "Commits",
                  icon: GitCommit,
                  count: commits.length,
                },
                {
                  id: "pr",
                  label: "Pull Requests",
                  icon: GitPullRequest,
                  count: pullRequests.length,
                },
                {
                  id: "issues",
                  label: "Issues",
                  icon: AlertCircle,
                  count: issues.length,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
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

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Résumé IA */}
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

            {/* Filtres */}
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

              {/* Filtres pour Commits */}
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

              {/* Filtres pour Pull Requests */}
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

              {/* Filtres pour Issues */}
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
                  {activeTab === "commits" && contributorsData.length}
                  {activeTab === "pr" && `${engagementMetrics.prMergeRate}%`}
                  {activeTab === "issues" &&
                    `${engagementMetrics.issueCloseRate}%`}
                </div>
              </div>
            </div>

            {/* Liste */}
            <div className="space-y-3">
              {/* Onglet Commits */}
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
                            <span>
                              {formatRelativeDate(new Date(commit.date))}
                            </span>
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

              {/* Onglet Pull Requests */}
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
                              <CheckCircle2
                                className="text-green-600"
                                size={18}
                              />
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
                            <span className="text-xs text-slate-500">
                              #{pr.id}
                            </span>
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

              {/* Onglet Issues */}
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
                              <CheckCircle2
                                className="text-purple-600"
                                size={18}
                              />
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
                            <span>
                              {formatRelativeDate(new Date(issue.date))}
                            </span>
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

        {/* 📊 Historique des rapports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileDown className="text-violet-600" size={20} />
              <h2 className="text-xl font-bold text-slate-900">
                Historique des rapports
              </h2>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              Générer nouveau rapport
            </Button>
          </div>

          <div className="space-y-2">
            {reportHistory.length > 0 ? (
              reportHistory.map((report) => (
                <div
                  key={report.id}
                  className="bg-white p-4 rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileDown className="text-violet-600" size={18} />
                    <div>
                      <div className="font-medium text-slate-900">
                        {report.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatRelativeDate(new Date(report.date))} •{" "}
                        {report.size}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Télécharger
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Aucun rapport disponible</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
