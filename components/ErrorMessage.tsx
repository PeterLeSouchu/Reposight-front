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
      className={`bg-white border-2 border-red-200 rounded-2xl shadow-lg ${
        variant === "full" ? "p-8 max-w-md w-full" : "p-6"
      } ${className}`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div
          className={`rounded-full bg-red-100 flex items-center justify-center ${
            variant === "full" ? "w-16 h-16" : "w-14 h-14"
          }`}
        >
          <AlertCircle
            className="text-red-600"
            size={variant === "full" ? 32 : 28}
          />
        </div>
        <div>
          <h3
            className={`font-bold text-slate-900 mb-2 ${
              variant === "full" ? "text-xl" : "text-lg"
            }`}
          >
            {title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed bg-red-200 rounded-full p-2 inline-flex items-center justify-center">
            {message}
          </p>
          <p className="text-slate-600 mt-3 text-xs italic leading-relaxed">
            {subtitle}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`bg-violet-600 cursor-pointer hover:bg-violet-700 text-white rounded-lg transition-colors font-medium shadow-md ${
              variant === "full" ? "mt-2 px-6 py-2" : "px-5 py-2 text-sm"
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
      <div className="relative min-h-screen flex items-center justify-center p-8 text-slate-900 bg-[#fafafa]">
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
      className="relative z-10 flex items-center justify-center py-16"
    >
      {content}
    </motion.div>
  );
}
