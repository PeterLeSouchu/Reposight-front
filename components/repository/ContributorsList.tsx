"use client";

import { Users } from "lucide-react";
import type { ContributorDisplay } from "@/types/repository";
import { EmptyState } from "@/components/EmptyState";
import { Panel } from "@/components/app/Panel";

interface ContributorsListProps {
  contributors: ContributorDisplay[];
  className?: string;
}

export function ContributorsList({ contributors, className }: ContributorsListProps) {
  const maxCommits = Math.max(...contributors.map((c) => c.commits), 1);

  return (
    <Panel title="Contributeurs" icon={Users} className={className}>
      {contributors.length > 0 ? (
        <ul className="-mx-2 space-y-1">
          {contributors.map((contributor) => (
            <li key={contributor.name}>
              <a
                href={contributor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-iris-50"
              >
                <img
                  src={contributor.avatar}
                  alt=""
                  className="size-9 shrink-0 rounded-full ring-2 ring-white"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-ink group-hover:text-iris-700">
                      {contributor.name}
                    </span>
                    <span className="shrink-0 text-xs text-ink/50">
                      {contributor.commits} commit{contributor.commits > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-iris-50" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-iris-400 to-iris-600"
                      style={{ width: `${(contributor.commits / maxCommits) * 100}%` }}
                    />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<Users size={18} />}
          title="Aucun contributeur pour l'instant"
          description="Les membres actifs de ce dépôt s'afficheront ici dès qu'ils contribueront."
        />
      )}
    </Panel>
  );
}
