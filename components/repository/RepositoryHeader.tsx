"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  GitBranch,
  Star,
  GitFork,
  Eye,
  Users,
  RefreshCw,
  FileDown,
  GitCommit,
  Trash2,
  Scale,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  formatRelativeDate,
  getLanguageColor,
  getErrorMessage,
} from "@/lib/utils";
import { useMutationDeleteRepo } from "@/mutation/useMutationDeleteRepo";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { RepoInfo } from "@/query/useQueryRepo";

interface RepositoryHeaderProps {
  info: RepoInfo;

  onRefresh: () => void;
}

export function RepositoryHeader({
  info,

  onRefresh,
}: RepositoryHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { mutate: deleteRepo, isPending: isDeleting } = useMutationDeleteRepo();

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    deleteRepo(info.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["repos"] });
        toast.success("Dépôt supprimé avec succès");
        setShowDeleteModal(false);
        router.push("/repositories");
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        toast.error("Erreur lors de la suppression", {
          description: message,
        });
        // Le modal reste ouvert en cas d'erreur
      },
    });
  };
  const languages = info.languages.map((lang) => ({
    name: lang.name,
    percentage: lang.percentage,
    color: getLanguageColor(lang.name),
  }));

  const stats = {
    stars: info.starsCount,
    forks: 0,
    watchers: 0,
    contributors: info.contributorsCount,
    size: info.sizeMb,
    license: null as string | null,
  };

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

  const handleBack = () => {
    router.push("/repositories");
  };

  return (
    <>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200/50 rounded-2xl p-6 sm:p-8 shadow-lg mb-6 relative overflow-hidden"
      >
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
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {info.name}
                    </h1>
                    {info.url && (
                      <a
                        href={info.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-violet-100 transition-colors"
                        aria-label="Ouvrir le repository sur GitHub"
                      >
                        <ExternalLink className="text-violet-600" size={18} />
                      </a>
                    )}
                  </div>
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
                  <span className="text-sm font-medium">{stats.watchers}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="text-violet-600" size={16} />
                  <span className="text-sm font-medium">
                    {stats.contributors}
                  </span>
                </div>

                {stats.license && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Scale className="text-slate-500" size={16} />
                    <span className="text-sm font-medium">{stats.license}</span>
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
                    •{lastCommit.message} •{" "}
                    {formatRelativeDate(new Date(lastCommit.date))}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <Button
                variant="outline"
                className="bg-white cursor-pointer border-violet-200 hover:bg-violet-50 text-violet-700"
                onClick={onRefresh}
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
                onClick={handleDeleteClick}
                variant="outline"
                className="bg-white cursor-pointer border-red-200 hover:bg-red-50 text-red-700"
                disabled={isDeleting}
              >
                <Trash2 size={16} />
                {isDeleting ? "Suppression..." : "Supprimer le dépôt"}
              </Button>
            </div>
          </div>
        </div>

        <ConfirmDialog
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          title="Supprimer le dépôt"
          description="Êtes-vous sûr de vouloir supprimer ce dépôt ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={handleDeleteConfirm}
          variant="destructive"
          closeOnConfirm={false}
        />
      </motion.div>
    </>
  );
}
