"use client";

import { Clock, ExternalLink, FolderGit2, Globe, Lock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Repo } from "@/types/repo";
import {
  formatRelativeDate,
  getLanguageColor,
  getErrorMessage,
} from "@/lib/utils";
import { useMutationDeleteRepo } from "@/mutation/useMutationDeleteRepo";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { toast } from "sonner";

interface RepoCardProps {
  repo: Repo;
}

export function RepoCard({ repo }: RepoCardProps) {
  const router = useRouter();
  const { mutate: deleteRepo } = useMutationDeleteRepo();
  const queryClient = useQueryClient();
  const { openConfirmDialog, closeConfirmDialog } = useConfirmDialog();

  const handleCardClick = () => {
    router.push(`/repository/${repo.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmDialog({
      title: "Supprimer le dépôt",
      description: "Êtes-vous sûr de vouloir supprimer ce dépôt ?",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "destructive",
      onConfirm: () => {
        deleteRepo(repo.id, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["repos"] });
            toast.success("Dépôt supprimé avec succès");
            closeConfirmDialog();
          },
          onError: (error) => {
            const message = getErrorMessage(error);
            toast.error("Erreur lors de la suppression", {
              description: message,
            });
          },
        });
      },
      closeOnConfirm: false,
    });
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleCardClick();
      }}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-iris-100 bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-iris-200 hover:shadow-[0_20px_40px_-24px_rgba(83,27,168,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-iris-50 text-iris-600 ring-1 ring-iris-100">
            <FolderGit2 size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display font-semibold tracking-tight text-ink transition-colors group-hover:text-iris-700">
              {repo.name}
            </h3>
            <span className="mt-0.5 flex items-center gap-1 text-xs text-ink/50">
              {repo.private ? <Lock size={11} /> : <Globe size={11} />}
              {repo.private ? "Privé" : "Public"}
            </span>
          </div>
        </div>

        <div className="-mr-1.5 -mt-1 flex shrink-0 items-center transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg p-2 text-ink/40 transition-colors hover:bg-iris-50 hover:text-iris-600"
            aria-label="Ouvrir le dépôt sur GitHub"
          >
            <ExternalLink size={16} />
          </a>
          <button
            onClick={handleDeleteClick}
            className="cursor-pointer rounded-lg p-2 text-ink/40 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label="Retirer le dépôt de Reposight"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-ink/60">
        {repo.description || (
          <span className="text-ink/35">Aucune description</span>
        )}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-iris-100 pt-4 text-xs text-ink/55">
        {repo.language ? (
          <span className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            {repo.language}
          </span>
        ) : (
          <span />
        )}
        <span className="flex items-center gap-1.5">
          <Clock size={12} />
          {formatRelativeDate(new Date(repo.pushedAt))}
        </span>
      </div>
    </div>
  );
}
