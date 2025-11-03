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
import { Search, GitBranch, Check } from "lucide-react";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useMutationSelectRepos } from "@/mutation/useMutationSelectRepos";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage, formatRelativeDate } from "@/lib/utils";
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

  console.log("repos", repos);
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
        // Invalider la query des repos pour rafraîchir la liste
        queryClient.invalidateQueries({ queryKey: ["repos"] });
        // Afficher un toast de succès
        toast.success(
          `${selectedRepos.length} repo${
            selectedRepos.length > 1 ? "s" : ""
          } ajouté${selectedRepos.length > 1 ? "s" : ""} avec succès`
        );
        // Fermer la modal et reset
        onOpenChange(false);
        setSelectedRepos([]);
        setSearchQuery("");
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        toast.error("Erreur lors de l'ajout des repos", {
          description: message,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Ajouter des repositories</DialogTitle>
          <DialogDescription>
            Sélectionnez un ou plusieurs repositories à ajouter à votre
            dashboard
          </DialogDescription>
        </DialogHeader>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Rechercher un repo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-violet-200/50 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
          />
        </div>

        {/* Liste des repos */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <ErrorMessage
              error={error}
              title="Erreur lors du chargement des repos"
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
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedRepos.includes(repo.id)
                      ? "bg-violet-50 border-violet-300"
                      : "bg-slate-50 border-violet-200/50 hover:border-violet-300/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        selectedRepos.includes(repo.id)
                          ? "bg-violet-600 border-violet-600"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedRepos.includes(repo.id) && (
                        <Check className="text-white" size={12} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <GitBranch className="text-violet-600" size={16} />
                        <h3 className="font-semibold text-slate-900 truncate">
                          {repo.name}
                        </h3>
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
                      {repo.description && (
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                            {repo.language}
                          </span>
                        )}
                        {repo.pushed_at && (
                          <span>
                            Mis à jour {formatRelativeDate(repo.pushed_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              Aucun repo trouvé
            </div>
          )}
        </div>

        {/* Footer avec boutons */}
        <div className="flex items-center justify-between pt-4 border-t border-violet-200/50">
          <span className="text-sm text-slate-600">
            {selectedRepos.length > 0
              ? `${selectedRepos.length} repo${
                  selectedRepos.length > 1 ? "s" : ""
                } sélectionné${selectedRepos.length > 1 ? "s" : ""}`
              : "Sélectionnez au moins un repo"}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onOpenChange(false);
                setSelectedRepos([]);
                setSearchQuery("");
              }}
              className="px-4 py-2 cursor-pointer text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              disabled={selectedRepos.length === 0 || isAdding}
              className="px-6 py-2 bg-violet-600 cursor-pointer hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? "Ajout en cours..." : "Ajouter"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
