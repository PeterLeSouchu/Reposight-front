"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function RepositoriesSkeleton() {
  return (
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-2xl bg-slate-200" />
      ))}
    </div>
  );
}
