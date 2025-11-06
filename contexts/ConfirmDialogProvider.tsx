"use client";

import { useState, useCallback } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  ConfirmDialogContext,
  type ConfirmDialogConfig,
} from "@/contexts/ConfirmDialogContext";

interface ConfirmDialogProviderProps {
  children: React.ReactNode;
}

export function ConfirmDialogProvider({
  children,
}: ConfirmDialogProviderProps) {
  const [config, setConfig] = useState<ConfirmDialogConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openConfirmDialog = useCallback((newConfig: ConfirmDialogConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);

    setTimeout(() => {
      setConfig(null);
    }, 200);
  }, []);

  const handleConfirm = useCallback(() => {
    if (config) {
      config.onConfirm();
      if (config.closeOnConfirm !== false) {
        closeDialog();
      }
    }
  }, [config, closeDialog]);

  return (
    <ConfirmDialogContext.Provider
      value={{ openConfirmDialog, closeConfirmDialog: closeDialog }}
    >
      {children}
      {config && (
        <ConfirmDialog
          open={isOpen}
          onOpenChange={closeDialog}
          title={config.title}
          description={config.description}
          confirmText={config.confirmText}
          cancelText={config.cancelText}
          variant={config.variant}
          onConfirm={handleConfirm}
          closeOnConfirm={config.closeOnConfirm}
        />
      )}
    </ConfirmDialogContext.Provider>
  );
}
