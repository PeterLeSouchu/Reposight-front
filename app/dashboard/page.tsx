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
  Bookmark,
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

// Type pour les repos
interface Repo {
  id: string;
  name: string;
  description: string;
  lastCommit: {
    message: string;
    author: string;
    date: string;
    hash: string;
  };
}

// Fausses données de repos
const mockRepos: Repo[] = [
  {
    id: "1",
    name: "react-dashboard",
    description:
      "Un dashboard moderne et réactif pour la gestion de projets avec React et TypeScript",
    lastCommit: {
      message: "feat: ajout du système de notifications",
      author: "Jean Dupont",
      date: "Il y a 2 heures",
      hash: "a3f5b2c",
    },
  },
  {
    id: "2",
    name: "api-backend",
    description:
      "API REST complète avec Node.js, Express et MongoDB pour la gestion des utilisateurs",
    lastCommit: {
      message: "fix: correction du bug de synchronisation",
      author: "Marie Martin",
      date: "Il y a 5 heures",
      hash: "b7d4e1f",
    },
  },
  {
    id: "3",
    name: "mobile-app",
    description:
      "Application mobile cross-platform développée avec React Native et Expo",
    lastCommit: {
      message: "refactor: amélioration des performances",
      author: "Pierre Durand",
      date: "Il y a 1 jour",
      hash: "c9a2b8d",
    },
  },
  {
    id: "4",
    name: "design-system",
    description:
      "Système de design cohérent avec des composants réutilisables et une documentation complète",
    lastCommit: {
      message: "docs: mise à jour de la documentation",
      author: "Sophie Leroy",
      date: "Il y a 2 jours",
      hash: "d4f6c3a",
    },
  },
  {
    id: "5",
    name: "auth-service",
    description:
      "Service d'authentification sécurisé avec JWT, OAuth2 et gestion des sessions",
    lastCommit: {
      message: "security: amélioration de la validation des tokens",
      author: "Lucas Bernard",
      date: "Il y a 3 jours",
      hash: "e8b5d2c",
    },
  },
  {
    id: "6",
    name: "data-analytics",
    description:
      "Plateforme d'analyse de données en temps réel avec visualisations interactives",
    lastCommit: {
      message: "feat: ajout des graphiques en temps réel",
      author: "Emma Rousseau",
      date: "Il y a 4 jours",
      hash: "f2a7e4b",
    },
  },
];

export default function Dashboard() {
  const { data, isLoading, error } = useQueryUser();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useMutationLogout();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounce de 0.5 seconde
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtrage des repos
  const filteredRepos = useMemo(() => {
    if (!debouncedSearch.trim()) return mockRepos;

    const query = debouncedSearch.toLowerCase();
    return mockRepos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.description.toLowerCase().includes(query) ||
        repo.lastCommit.message.toLowerCase().includes(query)
    );
  }, [debouncedSearch]);

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
          className="absolute top-0 left-1/2 w-[1400px] h-[1400px] bg-indigo-600/20 rounded-full blur-[350px] -translate-x-1/2"
          animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[900px] h-[900px] bg-purple-500/15 rounded-full blur-[280px]"
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-indigo-400/12 rounded-full blur-[220px]"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.08, 1] }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      <div className="absolute inset-0 z-0 dot-pattern" />

      <div className="relative z-10 flex justify-between items-center mb-8">
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
              <h2 className="text-2xl font-bold text-slate-900">
                {data.username}
              </h2>
              <p className="text-sm text-violet-600">{data.email}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <button className="px-4 py-2 cursor-pointer bg-slate-50 border border-violet-200/50 hover:bg-slate-100 hover:border-violet-300/50 text-slate-900 rounded-lg transition-all font-medium shadow-sm flex justify-center items-center gap-2">
            <Bookmark className="text-violet-600" size={18} />
            Signets
          </button>
          <button className="px-6 py-2 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all font-medium shadow-md shadow-violet-900/20 border border-violet-500/30 flex justify-center items-center gap-2">
            <Plus size={18} /> Nouveau repo
          </button>
        </motion.div>
      </div>

      {/* Barre de recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="relative z-10 mb-8 flex items-center gap-3"
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
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-violet-200/50 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-sm"
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-4 cursor-pointer bg-slate-50 border border-violet-200/50 rounded-2xl text-slate-900 hover:bg-slate-100 hover:border-violet-300/50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <RefreshCw
            className={`text-violet-600 ${isRefreshing ? "animate-spin" : ""}`}
            size={20}
          />
        </button>
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
                        // handleBookmark(repo.id);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Bookmark size={14} />
                      Ajouté aux signets
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
    </div>
  );
}
