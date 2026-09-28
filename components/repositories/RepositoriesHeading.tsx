"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/public/Brand";
import { Skeleton } from "@/components/ui/skeleton";

interface RepositoriesHeadingProps {
  username?: string;
  repoCount?: number;
  isLoading: boolean;
  onAddRepo: () => void;
}

export function RepositoriesHeading({
  username,
  repoCount,
  isLoading,
  onAddRepo,
}: RepositoriesHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {isLoading || !username ? (
          <>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="mt-3 h-5 w-32" />
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Bonjour, {username}
            </h1>
            <p className="mt-2 text-ink/60">
              {repoCount === 0
                ? "Aucun dépôt suivi pour le moment"
                : `${repoCount} dépôt${(repoCount ?? 0) > 1 ? "s" : ""} suivi${(repoCount ?? 0) > 1 ? "s" : ""}`}
            </p>
          </>
        )}
      </div>

      <button
        id="add-repo-button"
        onClick={onAddRepo}
        className={cn(buttonStyles.primary, "h-11 cursor-pointer self-start sm:self-auto")}
      >
        <Plus size={18} />
        Nouveau dépôt
      </button>
    </div>
  );
}
