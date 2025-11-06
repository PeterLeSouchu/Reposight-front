"use client";

import { Plus, GitBranch } from "lucide-react";
import { motion } from "motion/react";

interface EmptyRepositoriesStateProps {
  isEmpty: boolean;
  onAddRepo: () => void;
}

export function EmptyRepositoriesState({
  isEmpty,
  onAddRepo,
}: EmptyRepositoriesStateProps) {
  if (!isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 text-center py-16"
      >
        <p className="text-slate-600 text-lg">Aucun dépôt trouvé</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex flex-col items-center justify-center py-20 px-6"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-violet-100 rounded-full blur-2xl opacity-50 animate-pulse" />
        <div className="relative w-32 h-32 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-violet-200">
          <GitBranch className="text-violet-600" size={64} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        Aucun dépôt pour le moment
      </h3>
      <p className="text-slate-600 text-center max-w-md mb-8">
        Commencez par ajouter vos premiers dépôts GitHub pour bénéficier
        d'analyses détaillées et de rapports personnalisés.
      </p>
      <button
        onClick={onAddRepo}
        className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors font-medium shadow-lg cursor-pointer shadow-violet-900/20 border border-violet-500/30 flex items-center gap-2"
      >
        <Plus size={20} />
        Ajouter mon premier dépôt
      </button>
    </motion.div>
  );
}
