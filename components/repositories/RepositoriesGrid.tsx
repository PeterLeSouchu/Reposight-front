"use client";

import { motion } from "motion/react";
import { RepoCard } from "./RepoCard";
import type { Repo } from "@/types/repo";

interface RepositoriesGridProps {
  repos: (Omit<Repo, "selectedAt" | "pushed_at"> & { pushed_atDate: Date })[];
}

export function RepositoriesGrid({ repos }: RepositoriesGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {repos.map((repo, index) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.4 + index * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <RepoCard repo={repo} />
        </motion.div>
      ))}
    </motion.div>
  );
}
