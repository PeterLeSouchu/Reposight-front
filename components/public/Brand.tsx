import Link from "next/link";
import { cn } from "@/lib/utils";

// « R » dessiné dans une grille de contributions 4 × 5 : les cases allumées forment la lettre
const LOGO_CELLS = [
  [1, 1, 1, 0],
  [1, 0, 0, 1],
  [1, 1, 1, 0],
  [1, 0, 1, 0],
  [1, 0, 0, 1],
];

export function LogoMark({ className }: { className?: string }) {
  const cell = 3.6;
  const gap = 1.1;
  const offsetX = (32 - (4 * cell + 3 * gap)) / 2;
  const offsetY = (32 - (5 * cell + 4 * gap)) / 2;

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="reposight-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8d6aef" />
          <stop offset="100%" stopColor="#531ba8" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#reposight-logo)" />
      {LOGO_CELLS.map((row, y) =>
        row.map((lit, x) => (
          <rect
            key={`${x}-${y}`}
            x={offsetX + x * (cell + gap)}
            y={offsetY + y * (cell + gap)}
            width={cell}
            height={cell}
            rx={0.9}
            fill="#fff"
            // La jambe du R est plus pâle, comme un niveau d'activité plus faible
            opacity={lit ? (y >= 3 && x > 0 ? 0.7 : 1) : 0.16}
          />
        ))
      )}
    </svg>
  );
}

export function Brand({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Reposight, accueil"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-iris-400",
        className
      )}
    >
      <LogoMark className="size-8 drop-shadow-[0_4px_10px_rgba(101,35,204,0.35)]" />
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        Reposight
      </span>
    </Link>
  );
}

export function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// Boutons partagés des pages publiques
export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-iris-500 to-iris-700 px-6 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_-10px_rgba(101,35,204,0.7)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-500",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-iris-200 bg-white px-6 font-semibold text-ink transition-colors hover:border-iris-300 hover:bg-iris-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-500",
};
