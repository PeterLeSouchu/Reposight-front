import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

// Bloc de contenu des pages connectées
export function Panel({ title, icon: Icon, action, className, children }: PanelProps) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col rounded-2xl border border-iris-100 bg-white p-5 shadow-[0_1px_2px_rgba(42,14,87,0.04)] sm:p-6",
        className
      )}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink">
          <span className="flex size-8 items-center justify-center rounded-lg bg-iris-50 text-iris-600">
            <Icon size={16} />
          </span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
