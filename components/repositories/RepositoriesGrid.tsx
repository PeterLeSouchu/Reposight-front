"use client";

import { motion } from "motion/react";
import { RepoCard } from "./RepoCard";
import type { Repo } from "@/types/repo";

interface RepositoriesGridProps {
  repos: Repo[];
}

export function RepositoriesGrid({ repos }: RepositoriesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo, index) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: Math.min(index, 8) * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <RepoCard repo={repo} />
        </motion.div>
      ))}
    </div>
  );
}
