"use client";

import { LogOut, Plus, ExternalLink, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutationDeleteAccount } from "@/mutation/useMutationDeleteAccount";
import { useAuthStore } from "@/lib/authStore";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

interface UserData {
  username: string;
  email: string;
  avatar: string;
}

interface UserHeaderProps {
  user: UserData | undefined;
  isLoading: boolean;
  isLoggingOut: boolean;
  onAddRepo: () => void;
  onLogout: () => void;
}

export function UserHeader({
  user,
  isLoading,
  isLoggingOut,
  onAddRepo,
  onLogout,
}: UserHeaderProps) {
  const { mutate: deleteAccount } = useMutationDeleteAccount();
  const { openConfirmDialog, closeConfirmDialog } = useConfirmDialog();

  const handleDeleteAccountClick = () => {
    openConfirmDialog({
      title: "Supprimer mon compte",
      description:
        "Êtes-vous sûr de vouloir supprimer votre compte ? Toutes vos données seront définitivement supprimées.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "destructive",
      onConfirm: () => {
        deleteAccount(undefined, {
          onSuccess: () => {
            closeConfirmDialog();
            useAuthStore.getState().clearAccessToken();
            localStorage.clear();
            window.location.href = "/";
          },
          onError: (error) => {
            const message = getErrorMessage(error);
            toast.error("Erreur lors de la suppression du compte", {
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-between items-center gap-4 mb-8"
    >
      {isLoading && (
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-32 rounded-md bg-slate-200" />
            <Skeleton className="h-5 w-48 rounded-md bg-slate-200" />
          </div>
        </div>
      )}
      {user && (
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              id="avatar-dropdown"
              className="cursor-pointer border-none outline-none hover:opacity-90 transition-opacity"
            >
              <img
                src={user.avatar}
                alt={`Avatar de ${user.username}`}
                className="w-12 h-12 rounded-full border-2 border-violet-600/50 hover:border-violet-700/70 transition-all"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="flex flex-col gap-1">
                <span className="font-semibold text-sm">{user.username}</span>
                <span className="text-xs text-slate-600">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  className="flex items-center gap-2"
                  href={`https://github.com/${user.username}`}
                  target="_blank"
                >
                  <ExternalLink size={14} /> Profil Github
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleDeleteAccountClick}
              >
                <Trash2 size={14} /> Supprimer mon compte
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-500"
              >
                <LogOut className="text-red-600" size={16} />
                {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {user.username}
            </h2>
            <p className="text-xs sm:text-sm text-violet-600">{user.email}</p>
          </div>
        </div>
      )}

      <button
        id="add-repo-button"
        onClick={onAddRepo}
        className="w-10 h-10 sm:w-auto sm:px-6 sm:py-2 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium shadow-md shadow-violet-900/20 border border-violet-500/30 flex justify-center items-center gap-2"
      >
        <Plus size={20} />
        <span className="hidden sm:inline">Nouveau dépôt</span>
      </button>
    </motion.div>
  );
}
