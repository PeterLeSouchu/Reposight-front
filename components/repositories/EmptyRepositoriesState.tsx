"use client";

import { Plus, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/public/Brand";
import { ContributionGrid } from "@/components/public/ContributionGrid";

interface EmptyRepositoriesStateProps {
  isEmpty: boolean;
  onAddRepo: () => void;
}

export function EmptyRepositoriesState({
  isEmpty,
  onAddRepo,
}: EmptyRepositoriesStateProps) {
  if (!isEmpty) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-iris-200 bg-white/60 px-6 py-14 text-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-iris-50 text-iris-600">
          <SearchX size={20} />
        </span>
        <p className="mt-4 font-display font-semibold text-ink">
          Aucun dépôt ne correspond à votre recherche
        </p>
        <p className="mt-1 text-sm text-ink/55">
          Vérifiez l'orthographe ou essayez un autre nom.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-iris-100 bg-white px-6 py-16 text-center sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto max-w-2xl opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      >
        <ContributionGrid weeks={26} seed={5} animated={false} />
      </div>
      <div className="relative mx-auto max-w-md pt-10 sm:pt-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Aucun dépôt suivi pour le moment
        </h2>
        <p className="mt-3 leading-relaxed text-ink/60">
          Choisissez les dépôts GitHub à suivre : Reposight affichera leur
          activité, leurs commits, pull requests et issues.
        </p>
        <button
          onClick={onAddRepo}
          className={cn(buttonStyles.primary, "mt-8 h-11 cursor-pointer")}
        >
          <Plus size={18} />
          Ajouter mes premiers dépôts
        </button>
      </div>
    </div>
  );
}
