"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function RepositorySkeleton() {
  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden bg-[#fafafa]">
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8">
        {/* Bouton retour */}
        <Skeleton className="h-10 w-48 mb-6" />

        {/* Header */}
        <Skeleton className="h-64 rounded-2xl mb-6" />

        {/* Activité récente */}
        <Skeleton className="h-64 rounded-2xl mb-6" />

        {/* Graphique */}
        <Skeleton className="h-64 rounded-2xl mb-6" />

        {/* Comparaison */}
        <Skeleton className="h-48 rounded-2xl mb-6" />

        {/* Contributeurs */}
        <Skeleton className="h-64 rounded-2xl mb-6" />

        {/* Onglets */}
        <Skeleton className="h-96 rounded-2xl mb-6" />
      </div>
    </div>
  );
}
