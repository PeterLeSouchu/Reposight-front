import { GitBranch, GitCommitHorizontal, GitPullRequest, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { GithubMark } from "@/components/public/Brand";
import { ContributionGrid } from "@/components/public/ContributionGrid";

// Derniers commits réels de ce dépôt
const COMMITS = [
  { hash: "72f0bd7", message: "feat: add Docker", time: "il y a 12 min" },
  { hash: "21e6cdc", message: "fix: update readme", time: "il y a 2 h" },
  { hash: "1bf27be", message: "feat: add .env.example for CI/CD", time: "hier" },
  { hash: "2b63b85", message: "feat: add CI/CD with vercel", time: "il y a 2 j" },
];

const TABS = [
  { label: "Commits", count: 29, icon: GitCommitHorizontal, active: true },
  { label: "Pull requests", count: 3, icon: GitPullRequest },
  { label: "Issues", count: 0, icon: CircleDot },
];

// Aperçu du produit construit en HTML, utilisé dans le hero et sur la page de connexion
export function RepoPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-iris-100 bg-white text-ink shadow-[0_40px_100px_-30px_rgba(83,27,168,0.4)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-iris-100 px-5 py-4">
        <span className="flex min-w-0 items-center gap-2 text-sm">
          <GithubMark className="size-4 shrink-0 text-ink/50" />
          <span className="truncate">
            <span className="text-ink/50">reposight / </span>
            <span className="font-semibold">reposight-front</span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-iris-100 bg-iris-50 px-2 py-1 font-mono text-xs text-iris-700">
          <GitBranch size={12} />
          main
        </span>
      </div>

      <div className="px-5 pb-5 pt-5">
        <div className="flex items-center justify-between text-xs text-ink/55">
          <span>Activité sur 20 semaines</span>
          <span>
            <strong className="font-semibold text-ink">412</strong> contributions
          </span>
        </div>
        <ContributionGrid weeks={20} seed={7} className="mt-3" />
      </div>

      <div className="flex gap-1 overflow-x-auto border-y border-iris-100 bg-paper/60 px-3 py-2">
        {TABS.map(({ label, count, icon: Icon, active }) => (
          <span
            key={label}
            className={cn(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs",
              active ? "bg-iris-600 text-white" : "text-ink/55"
            )}
          >
            <Icon size={13} />
            {label}
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px]",
                active ? "bg-white/20" : "bg-iris-100"
              )}
            >
              {count}
            </span>
          </span>
        ))}
      </div>

      <ul className="divide-y divide-iris-100 px-5 py-1">
        {COMMITS.map((commit) => (
          <li key={commit.hash} className="flex items-center gap-3 py-3 text-sm">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-iris-400 to-iris-700 text-[10px] font-bold text-white">
              PL
            </span>
            <span className="min-w-0 flex-1 truncate text-ink/85">{commit.message}</span>
            <span className="hidden font-mono text-xs text-iris-600 sm:inline">
              {commit.hash}
            </span>
            <span className="w-20 shrink-0 text-right text-xs text-ink/45">
              {commit.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
