"use client";

import { motion } from "motion/react";
import { ExternalLink, GitBranch, Clock, Trash2 } from "lucide-react";
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
  repo: Omit<Repo, "selectedAt" | "pushed_at"> & { pushed_atDate: Date };
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handleCardClick}
      className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-sm sm:hover:shadow-xl sm:hover:border-violet-300/50 transition-all duration-300 cursor-pointer group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <GitBranch className="text-white" size={18} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors break-words leading-tight">
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
            onClick={handleDeleteClick}
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

      <div className="flex-1 flex flex-col">
        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
          {repo.description || "Aucune description"}
        </p>

        {repo.language && (
          <div className="flex items-center gap-2 mb-4">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            ></span>
            <span className="text-xs text-slate-600 font-medium">
              {repo.language}
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-violet-200/30 mt-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <Clock className="text-violet-500" size={14} />
          <span className="text-xs text-slate-500 font-medium">
            Mis à jour {formatRelativeDate(repo.pushed_atDate)}
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
  );
}
