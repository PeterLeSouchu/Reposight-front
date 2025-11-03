"use client";

import {
  LogOut,
  Plus,
  ExternalLink,
  Search,
  GitBranch,
  Clock,
  RefreshCw,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";

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
import { useQueryRepos } from "@/query/useQueryRepos";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useMutationDeleteRepo } from "@/mutation/useMutationDeleteRepo";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type SortType = "added" | "oldest-commit" | "newest-commit";

export default function Dashboard() {
  const { data, isLoading, error: userError } = useQueryUser();
  const {
    data: reposData,
    isLoading: isReposLoading,
    error: reposError,
  } = useQueryRepos();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useMutationLogout();
  const { mutate: deleteRepo, isPending: isDeleting } = useMutationDeleteRepo();
  const queryClient = useQueryClient();
  console.log("reposData", reposData);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [sortType, setSortType] = useState<SortType>("added");
  const [isAddRepoModalOpen, setIsAddRepoModalOpen] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<number | null>(null);

  // Étant donné qu'il ne va pas y avoir des centaines ou des milliers de repo, j'ai opté pour une recherche (searchbar + filtre) en front uniquement.
  const filteredRepos = useMemo(() => {
    if (!reposData) return [];

    let repos = reposData.map((repo) => ({
      ...repo,
      selectedAt: new Date(repo.selectedAt || repo.pushed_at),
      pushed_at: new Date(repo.pushed_at),
    }));

    // Filtrage par recherche
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      repos = repos.filter((repo) => repo.name.toLowerCase().includes(query));
    }

    // Tri par date
    const sortedRepos = [...repos].sort((a, b) => {
      switch (sortType) {
        case "added":
          return b.selectedAt.getTime() - a.selectedAt.getTime();
        case "newest-commit":
          return b.pushed_at.getTime() - a.pushed_at.getTime();
        case "oldest-commit":
          return a.pushed_at.getTime() - b.pushed_at.getTime();
        default:
          return 0;
      }
    });

    return sortedRepos;
  }, [reposData, debouncedSearch, sortType]);

  const handleClientSideLogout = () => {
    useAuthStore.getState().clearAccessToken();

    localStorage.clear();

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

  const handleDeleteClick = (id: number) => {
    setRepoToDelete(id);
  };

  const handleDeleteConfirm = () => {
    if (repoToDelete === null) return;

    deleteRepo(repoToDelete, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["repos"] });
        toast.success("Repository supprimé avec succès");
        setRepoToDelete(null);
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        toast.error("Erreur lors de la suppression", {
          description: message,
        });
        setRepoToDelete(null);
      },
    });
  };

  if (userError || reposError) {
    return (
      <ErrorMessage
        error={userError || reposError}
        title="Erreur de chargement des données"
        // onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden bg-[#fafafa]">
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

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center gap-4 mb-8">
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
                    <span className="font-semibold text-sm">
                      {data.username}
                    </span>
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
                <p className="text-xs sm:text-sm text-violet-600">
                  {data.email}
                </p>
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
            <button className="px-4 py-2 cursor-pointer bg-slate-50 border border-violet-200/50 rounded-2xl text-slate-900 hover:bg-slate-100 hover:border-violet-300/50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              <RefreshCw
                // className={`text-violet-600 ${"animate-spin"}`}
                className={`text-violet-600 `}
                size={20}
              />
            </button>
          </div>
        </motion.div>

        {isReposLoading ? (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : filteredRepos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 text-center py-16"
          >
            <p className="text-slate-600 text-lg">
              {reposData && reposData.length === 0
                ? "Aucun repository ajouté. Cliquez sur + pour en ajouter."
                : "Aucun repository trouvé"}
            </p>
          </motion.div>
        ) : (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-sm sm:hover:shadow-xl sm:hover:border-violet-300/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                      <GitBranch className="text-white" size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      {repo.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg cursor-pointer sm:hover:bg-violet-50 transition-colors group/link"
                      aria-label="Ouvrir le repository sur GitHub"
                    >
                      <ExternalLink
                        className="text-slate-400 sm:group-hover/link:text-violet-600 transition-colors"
                        size={18}
                      />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(repo.id);
                      }}
                      className="p-2 rounded-lg cursor-pointer sm:hover:bg-red-50 transition-colors group/trash"
                      aria-label="Supprimer le repository"
                    >
                      <Trash2
                        className="text-slate-400 sm:group-hover/trash:text-red-600 transition-colors"
                        size={18}
                      />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-5 line-clamp-2">
                  {repo.description}
                </p>

                <div className="pt-4 border-t border-violet-200/30">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Clock className="text-violet-500" size={14} />
                    <span className="text-xs text-slate-500 font-medium">
                      Mis à jour
                    </span>
                    <span className="text-xs text-slate-500">
                      {repo.pushed_at.toLocaleDateString("fr-FR")}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        repo.private
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {repo.private ? "Privé" : "Public"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AddRepoModal
          open={isAddRepoModalOpen}
          onOpenChange={setIsAddRepoModalOpen}
        />

        <ConfirmDialog
          open={repoToDelete !== null}
          onOpenChange={(open) => {
            if (!open) setRepoToDelete(null);
          }}
          title="Supprimer le repository"
          description="Êtes-vous sûr de vouloir supprimer ce repository ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={handleDeleteConfirm}
          variant="destructive"
        />
      </div>
    </div>
  );
}
