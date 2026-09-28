"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryGitHubRepos } from "@/query/useQueryGitHubRepos";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FolderGit2, Check, Globe, Lock } from "lucide-react";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useMutationSelectRepos } from "@/mutation/useMutationSelectRepos";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cn,
  getErrorMessage,
  formatRelativeDate,
  getLanguageColor,
} from "@/lib/utils";
import { buttonStyles } from "@/components/public/Brand";
import { Repo } from "@/types/repo";

interface AddRepoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRepoModal({ open, onOpenChange }: AddRepoModalProps) {
  const { data: repos, isLoading, error } = useQueryGitHubRepos(open);
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { mutate: selectRepos, isPending: isAdding } = useMutationSelectRepos();

  const filteredRepos = repos?.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRepo = (repoId: number) => {
    setSelectedRepos((prev) =>
      prev.includes(repoId)
        ? prev.filter((id) => id !== repoId)
        : [...prev, repoId]
    );
  };

  const handleAdd = () => {
    selectRepos(selectedRepos, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["repos"] });

        toast.success(
          `${selectedRepos.length} dépôt${
            selectedRepos.length > 1 ? "s" : ""
          } ajouté${selectedRepos.length > 1 ? "s" : ""} avec succès`
        );

        onOpenChange(false);
        setSelectedRepos([]);
        setSearchQuery("");
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        toast.error("Erreur lors de l'ajout des dépôts", {
          description: message,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-5 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter des dépôts</DialogTitle>
          <DialogDescription>
            Sélectionnez les dépôts GitHub que Reposight doit suivre.
          </DialogDescription>
        </DialogHeader>

        {/* Barre de recherche */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
            size={17}
          />
          <input
            type="text"
            placeholder="Rechercher un dépôt…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-iris-200 bg-white pl-11 pr-4 text-ink transition-[border-color,box-shadow] placeholder:text-ink/40 focus:border-iris-400 focus:outline-none focus:ring-4 focus:ring-iris-200/60"
          />
        </div>

        <div className="-mx-1 flex-1 space-y-2 overflow-y-auto px-1">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <ErrorMessage
              error={error}
              title="Erreur lors du chargement des dépôts"
              variant="inline"
            />
          ) : filteredRepos && filteredRepos.length > 0 ? (
            filteredRepos
              .filter(
                (repo): repo is Repo & { id: number } => repo.id !== undefined
              )
              .map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => toggleRepo(repo.id)}
                  className={cn(
                    "cursor-pointer rounded-xl border p-4 transition-colors",
                    selectedRepos.includes(repo.id)
                      ? "border-iris-400 bg-iris-50"
                      : "border-iris-100 bg-white hover:border-iris-200 hover:bg-iris-50/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                        selectedRepos.includes(repo.id)
                          ? "border-iris-600 bg-iris-600"
                          : "border-iris-200 bg-white"
                      )}
                    >
                      {selectedRepos.includes(repo.id) && (
                        <Check className="text-white" size={12} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FolderGit2 className="shrink-0 text-iris-600" size={15} />
                        <h3 className="truncate font-semibold text-ink">
                          {repo.name}
                        </h3>
                        <span className="flex shrink-0 items-center gap-1 text-xs text-ink/50">
                          {repo.private ? <Lock size={11} /> : <Globe size={11} />}
                          {repo.private ? "Privé" : "Public"}
                        </span>
                      </div>
                      {repo.description && (
                        <p className="mb-2 line-clamp-2 text-sm text-ink/60">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-ink/50">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span
                              className="size-2.5 rounded-full"
                              style={{
                                backgroundColor: getLanguageColor(repo.language),
                              }}
                            />
                            {repo.language}
                          </span>
                        )}
                        {repo.pushedAt && (
                          <span>
                            Mis à jour {formatRelativeDate(repo.pushedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="py-10 text-center text-sm text-ink/50">
              Aucun dépôt trouvé
            </div>
          )}
        </div>

        {/* Footer avec boutons */}
        <div className="flex flex-col-reverse gap-3 border-t border-iris-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-ink/60">
            {selectedRepos.length > 0
              ? `${selectedRepos.length} dépôt${
                  selectedRepos.length > 1 ? "s" : ""
                } sélectionné${selectedRepos.length > 1 ? "s" : ""}`
              : "Sélectionnez au moins un dépôt"}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onOpenChange(false);
                setSelectedRepos([]);
                setSearchQuery("");
              }}
              className="h-10 cursor-pointer rounded-full px-4 text-sm font-medium text-ink/70 transition-colors hover:bg-iris-50 hover:text-ink"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              disabled={selectedRepos.length === 0 || isAdding}
              className={cn(
                buttonStyles.primary,
                "h-10 cursor-pointer px-5 text-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              )}
            >
              {isAdding
                ? "Ajout en cours…"
                : selectedRepos.length > 1
                ? `Ajouter ${selectedRepos.length} dépôts`
                : "Ajouter"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
