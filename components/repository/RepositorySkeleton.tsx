"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AppShell } from "@/components/app/AppShell";

export function RepositorySkeleton() {
  return (
    <AppShell>
      <Skeleton className="h-5 w-28" />
      <Skeleton className="mt-4 h-64 rounded-3xl" />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[380px] rounded-2xl lg:col-span-2" />
        <Skeleton className="h-[380px] rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <Skeleton className="mt-6 h-96 rounded-2xl" />
    </AppShell>
  );
}
