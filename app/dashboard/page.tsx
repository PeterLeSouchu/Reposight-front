"use client";

import {
  LogOut,
  Plus,
  ExternalLink,
  Search,
  GitBranch,
  Clock,
  RefreshCw,
  MoreVertical,
  Edit,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useMemo } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useQueryUser } from "@/query/useQueryUser";
import { useMutationLogout } from "@/mutation/useMutationLogout";
import { useAuthStore } from "@/lib/authStore";
import { AddRepoModal } from "@/components/AddRepoModal";

// Type pour les repos
interface Repo {
  id: string;
  name: string;
  description: string;
  addedDate: Date; // Date d'ajout du projet
  lastCommit: {
    message: string;
    author: string;
    date: string;
    hash: string;
    dateTime: Date; // Date réelle du commit pour le tri
  };
}

type SortType = "added" | "oldest-commit" | "newest-commit";

// Fausses données de repos
const now = new Date();
const mockRepos: Repo[] = [
  {
    id: "1",
    name: "react-dashboard",
    description:
      "Un dashboard moderne et réactif pour la gestion de projets avec React et TypeScript",
    addedDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // Il y a 30 jours
    lastCommit: {
      message: "feat: ajout du système de notifications",
      author: "Jean Dupont",
      date: "Il y a 2 heures",
      hash: "a3f5b2c",
      dateTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Il y a 2 heures
    },
  },
  {
    id: "2",
    name: "api-backend",
    description:
      "API REST complète avec Node.js, Express et MongoDB pour la gestion des utilisateurs",
    addedDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // Il y a 15 jours
    lastCommit: {
      message: "fix: correction du bug de synchronisation",
      author: "Marie Martin",
      date: "Il y a 5 heures",
      hash: "b7d4e1f",
      dateTime: new Date(now.getTime() - 5 * 60 * 60 * 1000), // Il y a 5 heures
    },
  },
  {
    id: "3",
    name: "mobile-app",
    description:
      "Application mobile cross-platform développée avec React Native et Expo",
    addedDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // Il y a 60 jours
    lastCommit: {
      message: "refactor: amélioration des performances",
      author: "Pierre Durand",
      date: "Il y a 1 jour",
      hash: "c9a2b8d",
      dateTime: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Il y a 1 jour
    },
  },
  {
    id: "4",
    name: "design-system",
    description:
      "Système de design cohérent avec des composants réutilisables et une documentation complète",
    addedDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // Il y a 45 jours
    lastCommit: {
      message: "docs: mise à jour de la documentation",
      author: "Sophie Leroy",
      date: "Il y a 2 jours",
      hash: "d4f6c3a",
      dateTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
    },
  },
  {
    id: "5",
    name: "auth-service",
    description:
      "Service d'authentification sécurisé avec JWT, OAuth2 et gestion des sessions",
    addedDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours
    lastCommit: {
      message: "security: amélioration de la validation des tokens",
      author: "Lucas Bernard",
      date: "Il y a 3 jours",
      hash: "e8b5d2c",
      dateTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
    },
  },
  {
    id: "6",
    name: "data-analytics",
    description:
      "Plateforme d'analyse de données en temps réel avec visualisations interactives",
    addedDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
    lastCommit: {
      message: "feat: ajout des graphiques en temps réel",
      author: "Emma Rousseau",
      date: "Il y a 4 jours",
      hash: "f2a7e4b",
      dateTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // Il y a 4 jours
    },
  },
];

export default function Dashboard() {
  const { data, isLoading, error } = useQueryUser();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useMutationLogout();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortType, setSortType] = useState<SortType>("added");
  const [isAddRepoModalOpen, setIsAddRepoModalOpen] = useState(false);

  // Debounce de 0.5 seconde
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtrage et tri des repos
  const filteredRepos = useMemo(() => {
    let repos = mockRepos;

    // Filtrage par recherche
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      repos = repos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query) ||
          repo.description.toLowerCase().includes(query) ||
          repo.lastCommit.message.toLowerCase().includes(query)
      );
    }

    // Tri par date
    const sortedRepos = [...repos].sort((a, b) => {
      switch (sortType) {
        case "added":
          // Par date d'ajout (du plus récent au plus ancien)
          return b.addedDate.getTime() - a.addedDate.getTime();
        case "newest-commit":
          // Par commit le plus récent
          return (
            b.lastCommit.dateTime.getTime() - a.lastCommit.dateTime.getTime()
          );
        case "oldest-commit":
          // Par commit le plus ancien
          return (
            a.lastCommit.dateTime.getTime() - b.lastCommit.dateTime.getTime()
          );
        default:
          return 0;
      }
    });

    return sortedRepos;
  }, [debouncedSearch, sortType]);

  const handleClientSideLogout = () => {
    // Nettoyer le token d'accès du store
    useAuthStore.getState().clearAccessToken();
    // Effacer le localStorage
    localStorage.clear();
    // Rediriger vers la page d'accueil
    window.location.href = "/";
  };

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        handleClientSideLogout();
      },
      onError: (error) => {
        console.error("Erreur lors de la déconnexion:", error);
        handleClientSideLogout();
      },
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulation d'un refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleEdit = (repoId: string) => {
    console.log("Modifier le repo:", repoId);
    // À implémenter
  };

  const handleDelete = (repoId: string) => {
    console.log("Supprimer le repo:", repoId);
    // À implémenter
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-900">
        <div className="text-xl text-red-600">
          Erreur lors du chargement des données
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-8 text-slate-900 overflow-hidden bg-[#fafafa]">
      {/* BACKGROUND - Gradient violet dynamique */}
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

      <div className="relative z-10 flex justify-between items-center gap-4 mb-8">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-32 rounded-md bg-slate-200" />
              <Skeleton className="h-5 w-48 rounded-md bg-slate-200" />
            </div>
          </motion.div>
        )}
        {data && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer border-none outline-none hover:opacity-90 transition-opacity">
                <img
                  src={data.avatar}
                  alt={`Avatar de ${data.username}`}
                  className="w-12 h-12 rounded-full border-2 border-violet-600/50 hover:border-violet-700/70 transition-all"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="font-semibold text-sm">{data.username}</span>
                  <span className="text-xs text-slate-600">{data.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Link
                    className="flex items-center gap-2 "
                    href={`https://github.com/${data.username}`}
                    target="_blank"
                  >
                    <ExternalLink size={14} /> Profil Github
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Trash2 size={14} /> Supprimer mon compte
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 cursor-pointer text-red-600  focus:text-red-500"
                >
                  <LogOut className="text-red-600" size={16} />
                  {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {data.username}
              </h2>
              <p className="text-xs sm:text-sm text-violet-600">{data.email}</p>
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          onClick={() => setIsAddRepoModalOpen(true)}
          className="w-10 h-10 sm:w-auto sm:px-6 sm:py-2 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium shadow-md shadow-violet-900/20 border border-violet-500/30 flex justify-center items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Nouveau repo</span>
        </motion.button>
      </div>

      {/* Barre de recherche et filtre */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="relative z-10 mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-3"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Rechercher un repository..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2  bg-slate-50 border border-violet-200/50 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full md:w-auto px-4 py-2 cursor-pointer bg-slate-50 border border-violet-200/50 rounded-2xl text-slate-900 hover:bg-slate-100 hover:border-violet-300/50 transition-colors shadow-sm flex items-center justify-center gap-2">
              <ArrowUpDown className="text-violet-600" size={18} />
              <span className="text-sm font-medium">
                {sortType === "added"
                  ? "Date d'ajout"
                  : sortType === "newest-commit"
                  ? "Commit récent"
                  : "Commit ancien"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuLabel>Trier par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortType("added")}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span>Date d'ajout</span>
                  {sortType === "added" && (
                    <span className="text-violet-600">✓</span>
                  )}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortType("newest-commit")}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span>Commit le plus récent</span>
                  {sortType === "newest-commit" && (
                    <span className="text-violet-600">✓</span>
                  )}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortType("oldest-commit")}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span>Commit le plus ancien</span>
                  {sortType === "oldest-commit" && (
                    <span className="text-violet-600">✓</span>
                  )}
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 cursor-pointer bg-slate-50 border border-violet-200/50 rounded-2xl text-slate-900 hover:bg-slate-100 hover:border-violet-300/50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <RefreshCw
              className={`text-violet-600 ${
                isRefreshing ? "animate-spin" : ""
              }`}
              size={20}
            />
          </button>
        </div>
      </motion.div>

      {/* Liste des repos */}
      {filteredRepos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-center py-16"
        >
          <p className="text-slate-600 text-lg">Aucun repository trouvé</p>
        </motion.div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 hover:shadow-xl hover:border-violet-300/50 transition-all duration-300 cursor-pointer group"
            >
              {/* En-tête du repo */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <GitBranch className="text-white" size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                    {repo.name}
                  </h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-lg cursor-pointer hover:bg-violet-50 transition-colors"
                  >
                    <MoreVertical
                      className="text-slate-400  hover:text-violet-600"
                      size={18}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(repo.id);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Edit size={14} />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(repo.id);
                      }}
                      className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-500"
                    >
                      <Trash2 size={14} />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-5 line-clamp-2">
                {repo.description}
              </p>

              {/* Dernier commit */}
              <div className="pt-4 border-t border-violet-200/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-violet-500" size={14} />
                  <span className="text-xs text-slate-500 font-medium">
                    Dernier commit
                  </span>
                </div>
                <p className="text-sm text-slate-900 font-medium mb-1 line-clamp-1">
                  {repo.lastCommit.message}
                </p>
                <div className="mt-2">
                  <span className="text-xs text-slate-500">
                    {repo.lastCommit.author} • {repo.lastCommit.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal d'ajout de repos */}
      <AddRepoModal
        open={isAddRepoModalOpen}
        onOpenChange={setIsAddRepoModalOpen}
      />
    </div>
  );
}
