"use client";

import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

interface ErrorMessageProps {
  error: unknown;
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
  className?: string;
  variant?: "full" | "inline";
}

export function ErrorMessage({
  error,
  title = "Erreur de chargement",
  subtitle = "Veuillez réessayer plus tard.",
  onRetry,
  className = "",
  variant = "full",
}: ErrorMessageProps) {
  const message = getErrorMessage(error);

  const content = (
    <div
      className={`rounded-2xl border border-rose-100 bg-white shadow-[0_20px_40px_-24px_rgba(42,14,87,0.3)] ${
        variant === "full" ? "w-full max-w-md p-8" : "w-full max-w-md p-6"
      } ${className}`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div
          className={`flex items-center justify-center rounded-2xl bg-rose-50 ${
            variant === "full" ? "size-14" : "size-12"
          }`}
        >
          <AlertCircle
            className="text-rose-600"
            size={variant === "full" ? 26 : 22}
          />
        </div>
        <div>
          <h3
            className={`mb-2 font-display font-semibold tracking-tight text-ink ${
              variant === "full" ? "text-xl" : "text-lg"
            }`}
          >
            {title}
          </h3>
          <p className="inline-flex items-center justify-center rounded-lg bg-rose-50 px-3 py-1.5 text-sm leading-relaxed text-rose-700">
            {message}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-ink/50">
            {subtitle}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`cursor-pointer rounded-full bg-iris-600 font-medium text-white transition-colors hover:bg-iris-700 ${
              variant === "full" ? "mt-2 px-6 py-2.5" : "px-5 py-2 text-sm"
            }`}
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );

  if (variant === "full") {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-paper p-6 text-ink">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex items-center justify-center py-10"
    >
      {content}
    </motion.div>
  );
}
