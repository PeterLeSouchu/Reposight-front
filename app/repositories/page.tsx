"use client";

import { useState, useMemo, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useNextStep } from "nextstepjs";
import { useQueryUser } from "@/query/useQueryUser";
import { useMutationLogout } from "@/mutation/useMutationLogout";
import { useAuthStore } from "@/lib/authStore";
import { AddRepoModal } from "@/components/repositories/AddRepoModal";
import { useQueryRepos } from "@/query/useQueryRepos";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useNotifyDeletedRepos } from "@/hooks/useNotifyDeletedRepos";
import { BackgroundDots } from "@/components/BackgroundDots";
import { UserHeader } from "@/components/repositories/UserHeader";
import {
  RepositoriesSearchBar,
  type SortType,
} from "@/components/repositories/RepositoriesSearchBar";
import { EmptyRepositoriesState } from "@/components/repositories/EmptyRepositoriesState";
import { RepositoriesSkeleton } from "@/components/repositories/RepositoriesSkeleton";
import { RepositoriesGrid } from "@/components/repositories/RepositoriesGrid";

export default function Repositories() {
  const { data, isLoading, error: userError } = useQueryUser();
  const {
    data: reposData,
    isLoading: isReposLoading,
    error: reposError,
  } = useQueryRepos();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useMutationLogout();
  const { startNextStep } = useNextStep();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [sortType, setSortType] = useState<SortType>("added");
  const [isAddRepoModalOpen, setIsAddRepoModalOpen] = useState(false);

  // Notifier les dépôts supprimés de GitHub
  useNotifyDeletedRepos(reposData?.reposDeletedFromGithub);

  // Démarrer le tour si l'utilisateur est nouveau
  useEffect(() => {
    if (!isLoading && !isReposLoading && data && reposData && data.isNewUser) {
      startNextStep("repositoriesTour");
    }
  }, [isLoading, isReposLoading, data, reposData, startNextStep]);

  // Étant donné qu'il ne va pas y avoir des centaines ou des milliers de dépôts, j'ai opté pour une recherche (searchbar + filtre) en front uniquement. Mais, à plus grande échelle, l'appli devra utiliser une pagination.
  const filteredRepos = useMemo(() => {
    if (!reposData) return [];

    let repos = reposData.repos.map((repo) => {
      const selectedAt = new Date(repo.selectedAt || repo.pushed_at);
      const pushed_atDate = new Date(repo.pushed_at);
      return {
        ...repo,
        selectedAt,
        pushed_atDate,
      };
    });

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      repos = repos.filter((repo) => repo.name.toLowerCase().includes(query));
    }

    const sortedRepos = [...repos].sort((a, b) => {
      switch (sortType) {
        case "added":
          return b.selectedAt.getTime() - a.selectedAt.getTime();
        case "newest-commit":
          return b.pushed_atDate.getTime() - a.pushed_atDate.getTime();
        case "oldest-commit":
          return a.pushed_atDate.getTime() - b.pushed_atDate.getTime();
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

  if (userError || reposError) {
    return (
      <ErrorMessage
        error={userError || reposError}
        title="Erreur de chargement des données"
      />
    );
  }

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden bg-[#fafafa]">
      <BackgroundDots />

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <UserHeader
          user={data}
          isLoading={isLoading}
          isLoggingOut={isLoggingOut}
          onAddRepo={() => setIsAddRepoModalOpen(true)}
          onLogout={handleLogout}
        />

        <RepositoriesSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortType={sortType}
          onSortChange={setSortType}
        />

        {isReposLoading ? (
          <RepositoriesSkeleton />
        ) : filteredRepos.length === 0 ? (
          <EmptyRepositoriesState
            isEmpty={reposData?.repos.length === 0}
            onAddRepo={() => setIsAddRepoModalOpen(true)}
          />
        ) : (
          <RepositoriesGrid repos={filteredRepos} />
        )}

        <AddRepoModal
          open={isAddRepoModalOpen}
          onOpenChange={setIsAddRepoModalOpen}
        />
      </div>
    </div>
  );
}
