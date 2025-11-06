"use client";

import { createContext, useContext } from "react";

export interface ConfirmDialogConfig {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  closeOnConfirm?: boolean;
}

interface ConfirmDialogContextType {
  openConfirmDialog: (config: ConfirmDialogConfig) => void;
  closeConfirmDialog: () => void;
}

export const ConfirmDialogContext =
  createContext<ConfirmDialogContextType | null>(null);

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      "useConfirmDialog must be used within ConfirmDialogProvider"
    );
  }
  return context;
}
