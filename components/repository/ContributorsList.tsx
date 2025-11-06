"use client";

import { motion } from "motion/react";
import { Users, ArrowUp, ArrowDown } from "lucide-react";
import type { ContributorDisplay } from "@/types/repository";

interface ContributorsListProps {
  contributors: ContributorDisplay[];
}

export function ContributorsList({ contributors }: ContributorsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.16 }}
      className="bg-slate-50 border border-violet-200/50 rounded-2xl p-6 shadow-lg mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="text-violet-600" size={20} />
          <h2 className="text-xl font-bold text-slate-900">Contributeurs</h2>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {contributors.length > 0 ? (
          contributors.map((contributor, index) => (
            <a
              key={index}
              href={contributor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-xl border border-violet-100 hover:border-violet-300/50 transition-all cursor-pointer group block"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={contributor.avatar}
                  alt={contributor.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900 group-hover:text-violet-600 transition-colors">
                    {contributor.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {contributor.commits} commits
                  </div>
                </div>
              </div>
              {(contributor.additions > 0 || contributor.deletions > 0) && (
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <ArrowUp className="text-green-600" size={12} />
                    <span className="font-medium text-green-600">
                      {contributor.additions.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowDown className="text-red-600" size={12} />
                    <span className="font-medium text-red-600">
                      {contributor.deletions.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>
              )}
            </a>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-slate-500">
            <p>Aucun contributeur disponible</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
