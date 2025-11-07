import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-violet-200/70 bg-white/60 px-6 py-10 text-center shadow-sm",
        className
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-900">{title}</p>
        {description && (
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {description}
          </p>
        )}
      </div>
      {children ? (
        <div className="mt-1 flex flex-wrap justify-center gap-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}
