import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

const PALETTES: Record<Tone, string[]> = {
  light: ["#ece8f7", "#d3c6fa", "#a98ef5", "#7442e3", "#4a1797"],
  dark: [
    "rgba(255,255,255,0.07)",
    "#46207f",
    "#6a3bc9",
    "#9d7ef5",
    "#dcd0ff",
  ],
};

// Générateur pseudo-aléatoire déterministe : même rendu côté serveur et client
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildLevels(weeks: number, seed: number) {
  const random = mulberry32(seed);
  const levels: number[][] = [];

  for (let w = 0; w < weeks; w++) {
    const column: number[] = [];
    // Alternance de périodes calmes et de sprints, avec une activité qui monte vers aujourd'hui
    const sprint = 0.55 + 0.45 * Math.sin(w * 0.7 + seed);
    const trend = 0.55 + 0.45 * (w / weeks);

    for (let d = 0; d < 7; d++) {
      const weekend = d === 0 || d === 6 ? 0.35 : 1;
      const value = random() * sprint * trend * weekend * 1.25;
      column.push(
        value < 0.16 ? 0 : value < 0.34 ? 1 : value < 0.55 ? 2 : value < 0.78 ? 3 : 4
      );
    }
    levels.push(column);
  }

  return levels;
}

type ContributionGridProps = {
  weeks?: number;
  seed?: number;
  tone?: Tone;
  animated?: boolean;
  className?: string;
};

export function ContributionGrid({
  weeks = 26,
  seed = 7,
  tone = "light",
  animated = true,
  className,
}: ContributionGridProps) {
  const levels = buildLevels(weeks, seed);
  const palette = PALETTES[tone];

  return (
    <div
      aria-hidden="true"
      className={cn("grid grid-flow-col grid-rows-7 gap-[3px]", className)}
      style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
    >
      {levels.map((column, w) =>
        column.map((level, d) => (
          <span
            key={`${w}-${d}`}
            className={cn(
              "aspect-square rounded-[3px]",
              animated && "contrib-cell"
            )}
            style={{
              backgroundColor: palette[level],
              animationDelay: animated ? `${w * 28 + d * 12}ms` : undefined,
            }}
          />
        ))
      )}
    </div>
  );
}

export function ContributionLegend({ tone = "light" }: { tone?: Tone }) {
  return (
    <div className="flex items-center gap-1.5">
      <span>Moins</span>
      {PALETTES[tone].map((color) => (
        <span
          key={color}
          className="size-2.5 rounded-[2px]"
          style={{ backgroundColor: color }}
        />
      ))}
      <span>Plus</span>
    </div>
  );
}
