"use client";

import { ChevronDown, ExternalLink, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryUser } from "@/query/useQueryUser";
import { useMutationLogout } from "@/mutation/useMutationLogout";
import { useMutationDeleteAccount } from "@/mutation/useMutationDeleteAccount";
import { useAuthStore } from "@/lib/authStore";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { getErrorMessage } from "@/lib/utils";

function clearSessionAndGoHome() {
  useAuthStore.getState().clearAccessToken();
  localStorage.clear();
  window.location.href = "/";
}

export function UserMenu() {
  const { data: user, isLoading } = useQueryUser();
  const { mutate: logout, isPending: isLoggingOut } = useMutationLogout();
  const { mutate: deleteAccount } = useMutationDeleteAccount();
  const { openConfirmDialog, closeConfirmDialog } = useConfirmDialog();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: clearSessionAndGoHome,
      onError: (error) => {
        console.error("Erreur lors de la déconnexion:", error);
        clearSessionAndGoHome();
      },
    });
  };

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
            clearSessionAndGoHome();
          },
          onError: (error) => {
            toast.error("Erreur lors de la suppression du compte", {
              description: getErrorMessage(error),
            });
          },
        });
      },
      closeOnConfirm: false,
    });
  };

  if (isLoading || !user) {
    return <Skeleton className="h-10 w-10 rounded-full sm:w-36" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        id="avatar-dropdown"
        className="flex cursor-pointer items-center gap-2.5 rounded-full border border-iris-100 bg-white py-1 pl-1 pr-1 transition-colors hover:border-iris-200 hover:bg-iris-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-500 sm:pr-3"
      >
        <img
          src={user.avatar}
          alt={`Avatar de ${user.username}`}
          className="size-8 rounded-full"
        />
        <span className="hidden max-w-[140px] truncate text-sm font-medium text-ink sm:inline">
          {user.username}
        </span>
        <ChevronDown size={14} className="hidden text-ink/45 sm:inline" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-3 py-2">
          <img src={user.avatar} alt="" className="size-9 rounded-full" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-ink">
              {user.username}
            </span>
            <span className="block truncate text-xs font-normal text-ink/55">
              {user.email}
            </span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={`https://github.com/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={14} />
            Profil GitHub
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut size={14} />
          {isLoggingOut ? "Déconnexion…" : "Se déconnecter"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDeleteAccountClick}>
          <Trash2 size={14} />
          Supprimer mon compte
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
