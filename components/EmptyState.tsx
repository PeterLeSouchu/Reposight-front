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
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-iris-200 bg-paper/60 px-6 py-10 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex size-10 items-center justify-center rounded-xl bg-iris-50 text-iris-600">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="font-medium text-ink">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-ink/55">{description}</p>
        )}
      </div>
      {children ? (
        <div className="mt-1 flex flex-wrap justify-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
