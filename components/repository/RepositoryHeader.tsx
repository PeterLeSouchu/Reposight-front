"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  FolderGit2,
  GitFork,
  Globe,
  HardDrive,
  Lock,
  RefreshCw,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import {
  cn,
  formatRelativeDate,
  getLanguageColor,
  getErrorMessage,
} from "@/lib/utils";
import { useMutationDeleteRepo } from "@/mutation/useMutationDeleteRepo";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import type { RepoInfo } from "@/query/useQueryRepo";

interface RepositoryHeaderProps {
  info: RepoInfo;
  onRefresh: () => void;
}

export function RepositoryHeader({ info, onRefresh }: RepositoryHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteRepo, isPending: isDeleting } = useMutationDeleteRepo();
  const { openConfirmDialog, closeConfirmDialog } = useConfirmDialog();

  const handleDeleteClick = () => {
    openConfirmDialog({
      title: "Supprimer le dépôt",
      description:
        "Êtes-vous sûr de vouloir supprimer ce dépôt ? Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "destructive",
      onConfirm: () => {
        deleteRepo(info.id, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["repos"] });
            toast.success("Dépôt supprimé avec succès");
            closeConfirmDialog();
            router.push("/repositories");
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
  const languages = info.languages.map((lang) => ({
    name: lang.name,
    percentage: lang.percentage,
    color: getLanguageColor(lang.name),
  }));

  const sizeLabel = Number.isInteger(info.sizeMb)
    ? `${info.sizeMb} Mo`
    : `${info.sizeMb.toFixed(1)} Mo`;

  const stats = [
    { icon: Star, label: `${info.starsCount} étoile${info.starsCount > 1 ? "s" : ""}` },
    {
      icon: Users,
      label: `${info.contributorsCount} contributeur${info.contributorsCount > 1 ? "s" : ""}`,
    },
    { icon: HardDrive, label: sizeLabel },
    ...(info.isFork ? [{ icon: GitFork, label: "Fork" }] : []),
  ];

  const secondaryAction =
    "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <>
      <Link
        href="/repositories"
        className="inline-flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-iris-700"
      >
        <ArrowLeft size={15} />
        Mes dépôts
      </Link>

      <section className="mt-4 rounded-3xl border border-iris-100 bg-white p-6 shadow-[0_1px_2px_rgba(42,14,87,0.04)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-iris-500 to-iris-700 text-white shadow-[0_10px_25px_-10px_rgba(101,35,204,0.7)]">
                <FolderGit2 size={22} />
              </span>
              <h1 className="min-w-0 break-words font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {info.name}
              </h1>
              <span className="flex items-center gap-1 rounded-full border border-iris-200 px-2.5 py-0.5 text-xs font-medium text-ink/65">
                {info.isPrivate ? <Lock size={11} /> : <Globe size={11} />}
                {info.isPrivate ? "Privé" : "Public"}
              </span>
            </div>

            <p className="mt-4 max-w-2xl leading-relaxed text-ink/60">
              {info.description || "Aucune description"}
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/65">
              {stats.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-1.5">
                  <Icon size={15} className="text-iris-500" />
                  {label}
                </li>
              ))}
            </ul>

            {info.lastCommit?.date ? (
              <div className="mt-5 flex min-w-0 items-center gap-2.5 rounded-xl bg-paper px-3 py-2.5 text-sm">
                <img
                  src={info.lastCommit.authorAvatar}
                  alt=""
                  className="size-5 shrink-0 rounded-full"
                />
                <span className="shrink-0 font-mono text-xs text-iris-600">
                  {info.lastCommit.sha.slice(0, 7)}
                </span>
                <span className="min-w-0 flex-1 truncate text-ink/80">
                  {info.lastCommit.message}
                </span>
                <span className="hidden shrink-0 text-xs text-ink/50 sm:inline">
                  {info.lastCommit.author},{" "}
                  {formatRelativeDate(new Date(info.lastCommit.date))}
                </span>
              </div>
            ) : (
              <p className="mt-5 text-sm text-ink/50">Aucun commit</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 lg:w-52 lg:flex-col">
            {info.url && (
              <a
                href={info.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  secondaryAction,
                  "border-iris-200 bg-white text-ink hover:border-iris-300 hover:bg-iris-50"
                )}
              >
                <ExternalLink size={15} />
                Voir sur GitHub
              </a>
            )}
            <button
              onClick={onRefresh}
              className={cn(
                secondaryAction,
                "border-iris-200 bg-white text-ink hover:border-iris-300 hover:bg-iris-50"
              )}
            >
              <RefreshCw size={15} />
              Actualiser
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className={cn(
                secondaryAction,
                "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
              )}
            >
              <Trash2 size={15} />
              {isDeleting ? "Suppression…" : "Supprimer le dépôt"}
            </button>
          </div>
        </div>

        {languages.length > 0 && (
          <div className="mt-7 border-t border-iris-100 pt-6">
            <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
              {languages.map((lang) => (
                <span
                  key={lang.name}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                />
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink/65">
              {languages.map((lang) => (
                <li key={lang.name} className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-medium text-ink">{lang.name}</span>
                  {lang.percentage.toFixed(1)} %
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
