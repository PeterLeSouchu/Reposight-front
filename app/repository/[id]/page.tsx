"use client";

import { motion } from "motion/react";
import { useState } from "react";
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
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Repo } from "@/types/repo";
import { formatRelativeDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  // Données mockées pour le développement
  const repo: Repo = {
    id: repoId || 1,
    name: "mon-super-repo",
    description:
      "Un repository de démonstration avec une description intéressante qui montre comment fonctionne l'affichage des détails.",
    html_url: "https://github.com/username/mon-super-repo",
    private: false,
    language: "TypeScript",
    pushed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    selectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const owner = "username";
  const lastCommit = {
    sha: "a1b2c3d4",
    message: "Fix: Correction du bug de synchronisation",
    author: {
      name: "Jean Dupont",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
      email: "jean@example.com",
    },
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    branch: "main",
  };

  const languages = [
    { name: "TypeScript", percentage: 65, color: "#3178c6" },
    { name: "CSS", percentage: 20, color: "#563d7c" },
    { name: "JavaScript", percentage: 10, color: "#f1e05a" },
    { name: "Other", percentage: 5, color: "#6e7681" },
  ];

  const stats = {
    stars: 142,
    forks: 38,
    watchers: 89,
    contributors: 12,
  };

  const recentActivity: ActivityEvent[] = [
    {
      type: "commit",
      id: "c1",
      title: "Fix: Correction du bug de synchronisation",
      author: {
        name: "Jean Dupont",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
      },
      date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: "merged",
      link: "#",
    },
    {
      type: "pr",
      id: "pr1",
      title: "feat: Ajout de la fonctionnalité de recherche",
      author: {
        name: "Marie Martin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      },
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: "merged",
      link: "#",
    },
    {
      type: "issue",
      id: "i1",
      title: "Problème de performance sur les grandes listes",
      author: {
        name: "Pierre Durand",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
      },
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      status: "open",
      link: "#",
    },
    {
      type: "commit",
      id: "c2",
      title: "refactor: Amélioration de la structure du code",
      author: {
        name: "Sophie Bernard",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      },
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      status: "merged",
      link: "#",
    },
    {
      type: "pr",
      id: "pr2",
      title: "docs: Mise à jour de la documentation",
      author: {
        name: "Luc Moreau",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luc",
      },
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "open",
      link: "#",
    },
  ];

  const commits: Commit[] = [
    {
      id: "c1",
      message: "Fix: Correction du bug de synchronisation",
      author: {
        name: "Jean Dupont",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
        email: "jean@example.com",
      },
      date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      branch: "main",
      sha: "a1b2c3d",
      type: "fix",
    },
    {
      id: "c2",
      message: "refactor: Amélioration de la structure du code",
      author: {
        name: "Sophie Bernard",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
        email: "sophie@example.com",
      },
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      branch: "main",
      sha: "b2c3d4e",
      type: "refactor",
    },
    {
      id: "c3",
      message: "feat: Ajout de la fonctionnalité de recherche",
      author: {
        name: "Marie Martin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
        email: "marie@example.com",
      },
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      branch: "feature/search",
      sha: "c3d4e5f",
      type: "feat",
    },
  ];

  const pullRequests: PullRequest[] = [
    {
      id: 45,
      title: "feat: Ajout de la fonctionnalité de recherche",
      state: "merged",
      author: {
        name: "Marie Martin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      },
      reviewers: [
        {
          name: "Jean Dupont",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
          approved: true,
        },
        {
          name: "Sophie Bernard",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
          approved: true,
        },
      ],
      labels: ["enhancement", "frontend"],
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      branch: "feature/search",
      baseBranch: "main",
    },
    {
      id: 46,
      title: "docs: Mise à jour de la documentation",
      state: "open",
      author: {
        name: "Luc Moreau",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luc",
      },
      reviewers: [
        {
          name: "Jean Dupont",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
          approved: false,
        },
      ],
      labels: ["documentation"],
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      branch: "docs/update",
      baseBranch: "main",
    },
  ];

  const issues: Issue[] = [
    {
      id: 123,
      title: "Problème de performance sur les grandes listes",
      state: "open",
      assignee: {
        name: "Jean Dupont",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
      },
      labels: ["bug", "performance"],
      comments: 5,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 124,
      title: "Feature request: Ajouter un mode sombre",
      state: "open",
      assignee: null,
      labels: ["enhancement", "ui"],
      comments: 12,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 125,
      title: "Bug: Le formulaire ne se soumet pas correctement",
      state: "closed",
      assignee: {
        name: "Marie Martin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      },
      labels: ["bug", "frontend"],
      comments: 8,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Données supplémentaires pour les nouvelles fonctionnalités
  const codeMetrics = {
    totalLines: 12450,
    totalFiles: 342,
    avgComplexity: 12.5,
    testCoverage: 78,
    techDebt: 3.2,
  };

  const contributors = [
    {
      name: "Jean Dupont",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
      commits: 142,
      additions: 5420,
      deletions: 1230,
    },
    {
      name: "Sophie Bernard",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      commits: 98,
      additions: 3420,
      deletions: 890,
    },
    {
      name: "Marie Martin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      commits: 76,
      additions: 2890,
      deletions: 650,
    },
    {
      name: "Luc Moreau",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luc",
      commits: 45,
      additions: 1200,
      deletions: 340,
    },
  ];

  const branches = [
    {
      name: "main",
      commits: 234,
      lastCommit: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      protected: true,
    },
    {
      name: "feature/search",
      commits: 12,
      lastCommit: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      protected: false,
    },
    {
      name: "docs/update",
      commits: 8,
      lastCommit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      protected: false,
    },
    {
      name: "fix/performance",
      commits: 5,
      lastCommit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      protected: false,
    },
  ];

  const dependencies = [
    {
      name: "react",
      version: "^18.2.0",
      type: "dependencies",
      outdated: false,
    },
    {
      name: "typescript",
      version: "^5.0.0",
      type: "dependencies",
      outdated: false,
    },
    { name: "axios", version: "^1.3.0", type: "dependencies", outdated: true },
    {
      name: "@tanstack/react-query",
      version: "^4.29.0",
      type: "dependencies",
      outdated: true,
    },
    {
      name: "tailwindcss",
      version: "^3.3.0",
      type: "devDependencies",
      outdated: false,
    },
  ];

  const alerts = [
    {
      type: "warning",
      icon: AlertTriangle,
      message: "2 dépendances obsolètes détectées",
      action: "Mettre à jour",
    },
    {
      type: "info",
      icon: Info,
      message: "1 issue stale (>7 jours sans activité)",
      action: "Voir",
    },
    {
      type: "success",
      icon: Shield,
      message: "Aucune vulnérabilité de sécurité détectée",
      action: null,
    },
  ];

  // Données pour le graphique d'activité (30 derniers jours)
  const activityData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    commits: Math.floor(Math.random() * 15) + 1,
    prs: Math.floor(Math.random() * 5),
    issues: Math.floor(Math.random() * 3),
  }));

  // Comparaison temporelle
  const comparison = {
    commits: { current: 23, previous: 18, change: +27.8 },
    prs: { current: 5, previous: 3, change: +66.7 },
    issues: { current: 12, previous: 15, change: -20 },
    contributors: { current: 8, previous: 6, change: +33.3 },
  };

  const handleBack = () => {
    router.push("/dashboard");
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
          <span>Retour au dashboard</span>
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
                      {owner}/{repo.name}
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                      {repo.description}
                    </p>
                  </div>
                </div>

                {/* Dernier commit */}
                <div className="flex items-center gap-3 mb-4 text-sm">
                  <GitCommit className="text-violet-600" size={16} />
                  <span className="text-slate-600">
                    <span className="font-medium">
                      {lastCommit.author.name}
                    </span>{" "}
                    • {lastCommit.message} •{" "}
                    {formatRelativeDate(new Date(lastCommit.date))}
                  </span>
                </div>

                {/* Langages */}
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  {languages.slice(0, 3).map((lang) => (
                    <div key={lang.name} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      ></span>
                      <span className="text-sm text-slate-600 font-medium">
                        {lang.name} {lang.percentage}%
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
                </div>

                {/* Résumé IA */}
                <div className="mt-4 flex items-center gap-2 text-sm bg-violet-100/50 text-violet-700 px-3 py-2 rounded-lg border border-violet-200/50">
                  <Sparkles className="text-violet-600" size={14} />
                  <span>Activité en hausse de +18% cette semaine 👀</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <Button
                  variant="outline"
                  className="bg-white border-violet-200 hover:bg-violet-50 text-violet-700"
                  onClick={() => window.open(repo.html_url, "_blank")}
                >
                  <ExternalLink size={16} />
                  Voir sur GitHub
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
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🔔 Alertes importantes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-6 space-y-2"
        >
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  alert.type === "warning"
                    ? "bg-orange-50 border-orange-200/50 text-orange-900"
                    : alert.type === "info"
                    ? "bg-blue-50 border-blue-200/50 text-blue-900"
                    : "bg-green-50 border-green-200/50 text-green-900"
                } flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
                {alert.action && (
                  <Button variant="ghost" size="sm" className="text-xs">
                    {alert.action}
                  </Button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* 📊 Métriques de code & Comparaison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="grid md:grid-cols-2 gap-6 mb-6"
        >
          {/* Métriques de code */}
          <div className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Code className="text-violet-600" size={20} />
              <h2 className="text-xl font-bold text-slate-900">
                Métriques de code
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-violet-100">
                <div className="text-sm text-slate-600 mb-1">
                  Lignes de code
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {codeMetrics.totalLines.toLocaleString()}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-violet-100">
                <div className="text-sm text-slate-600 mb-1">Fichiers</div>
                <div className="text-2xl font-bold text-slate-900">
                  {codeMetrics.totalFiles}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-violet-100">
                <div className="text-sm text-slate-600 mb-1">
                  Complexité moyenne
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {codeMetrics.avgComplexity}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-violet-100">
                <div className="text-sm text-slate-600 mb-1">
                  Couverture tests
                </div>
                <div className="text-2xl font-bold text-violet-600">
                  {codeMetrics.testCoverage}%
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">Tech Debt</span>
                <span className="font-medium text-slate-900">
                  {codeMetrics.techDebt}h estimées
                </span>
              </div>
            </div>
          </div>

          {/* Comparaison temporelle */}
          <div className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-violet-600" size={20} />
              <h2 className="text-xl font-bold text-slate-900">
                Cette semaine vs dernière
              </h2>
            </div>
            <div className="space-y-3">
              {Object.entries(comparison).map(([key, value]) => (
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
              ))}
            </div>
          </div>
        </motion.div>

        {/* 👥 Top contributeurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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
            {contributors.map((contributor, index) => (
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
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <ArrowUp className="text-green-600" size={12} />
                    <span className="font-medium text-green-600">
                      {contributor.additions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowDown className="text-red-600" size={12} />
                    <span className="font-medium text-red-600">
                      {contributor.deletions.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 🌳 Branches actives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="text-violet-600" size={20} />
              <h2 className="text-xl font-bold text-slate-900">
                Branches actives
              </h2>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              Voir toutes ({branches.length})
            </Button>
          </div>
          <div className="space-y-2">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <GitBranch className="text-violet-600" size={16} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {branch.name}
                      </span>
                      {branch.protected && (
                        <span title="Branche protégée">
                          <Shield className="text-violet-600" size={12} />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {branch.commits} commits •{" "}
                      {formatRelativeDate(new Date(branch.lastCommit))}
                    </div>
                  </div>
                </div>
                <a href="#" className="text-violet-600 hover:text-violet-700">
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 📦 Dépendances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="text-violet-600" size={20} />
              <h2 className="text-xl font-bold text-slate-900">Dépendances</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>{dependencies.length} packages</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                {dependencies.filter((d) => d.outdated).length} obsolètes
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {dependencies.map((dep, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      dep.outdated ? "bg-orange-500" : "bg-green-500"
                    }`}
                  ></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {dep.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {dep.version}
                      </span>
                      {dep.outdated && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                          Obsolète
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{dep.type}</div>
                  </div>
                </div>
                {dep.outdated && (
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mettre à jour
                  </Button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 📈 Graphique d'activité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="text-violet-600" size={20} />
              <h2 className="text-xl font-bold text-slate-900">
                Activité sur 30 jours
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
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
          {/* Graphique simple avec barres */}
          <div className="bg-white p-4 rounded-xl border border-violet-100">
            <div className="flex items-end justify-between gap-1 h-32">
              {activityData.map((day, index) => {
                const maxValue = Math.max(
                  ...activityData.map((d) => d.commits + d.prs + d.issues)
                );
                const height =
                  ((day.commits + day.prs + day.issues) / maxValue) * 100;
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
          </div>
        </motion.div>

        {/* 2️⃣ Activité récente (Timeline) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Activité récente
            </h2>
            <div className="flex items-center gap-2 text-sm bg-violet-100/50 text-violet-700 px-3 py-1 rounded-lg border border-violet-200/50">
              <Sparkles size={14} />
              <span>
                Depuis 24h : 3 commits, 1 PR mergée, 2 issues ouvertes
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
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
            ))}
          </div>
        </motion.div>

        {/* 3️⃣ Activité détaillée (Onglets) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl shadow-lg overflow-hidden"
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
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Tous les auteurs</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>Toutes les branches</option>
              </select>
              <select className="px-4 py-2 bg-white border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>30 derniers jours</option>
              </select>
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
                <div className="text-2xl font-bold text-violet-600">2.3</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-violet-100">
                <div className="text-sm text-slate-600 mb-1">
                  Top contributeur
                </div>
                <div className="text-lg font-bold text-slate-900">Jean D.</div>
              </div>
            </div>

            {/* Liste */}
            <div className="space-y-3">
              {/* Onglet Commits */}
              {activeTab === "commits" &&
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
                ))}

              {/* Onglet Pull Requests */}
              {activeTab === "pr" &&
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
                ))}

              {/* Onglet Issues */}
              {activeTab === "issues" &&
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
                ))}
            </div>
          </div>
        </motion.div>

        {/* 4️⃣ Paramètres & actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-6">
            <Settings className="text-violet-600" size={20} />
            <h2 className="text-xl font-bold text-slate-900">
              Paramètres & Actions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-violet-100">
                <div>
                  <div className="font-medium text-slate-900 mb-1">
                    Synchronisation automatique
                  </div>
                  <div className="text-sm text-slate-500">
                    Mise à jour toutes les 6 heures
                  </div>
                </div>
                <div className="w-12 h-6 bg-violet-600 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-violet-100">
                <div className="font-medium text-slate-900 mb-3">
                  Niveau d'analyse IA
                </div>
                <select className="w-full px-3 py-2 border border-violet-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                  <option>Complet (recommandé)</option>
                  <option>Standard</option>
                  <option>Basique</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-violet-100">
                <div className="font-medium text-slate-900 mb-3">
                  Historique des exports
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Rapport complet.pdf</span>
                    <span className="text-slate-400">Il y a 2 jours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Données.csv</span>
                    <span className="text-slate-400">Il y a 1 semaine</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="bg-white border-violet-200 hover:bg-violet-50 text-violet-700"
                >
                  <RefreshCw size={16} />
                  Forcer la synchronisation
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border-violet-200 hover:bg-violet-50 text-violet-700"
                >
                  <Download size={16} />
                  Exporter PDF
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border-red-200 hover:bg-red-50 text-red-700"
                >
                  <AlertCircle size={16} />
                  Supprimer le repository
                </Button>
              </div>
            </div>
          </div>

          {/* Suggestion IA */}
          <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/50 rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="text-violet-600 mt-0.5" size={18} />
              <div className="flex-1">
                <p className="text-sm text-slate-700">
                  <strong>Suggestion IA :</strong> Optimisation de la
                  synchronisation recommandée selon votre utilisation. Résumé
                  hebdomadaire disponible.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
