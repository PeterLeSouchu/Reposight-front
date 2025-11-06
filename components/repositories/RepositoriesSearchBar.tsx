"use client";

import { Search, ArrowUpDown } from "lucide-react";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortType = "added" | "oldest-commit" | "newest-commit";

interface RepositoriesSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
}

export function RepositoriesSearchBar({
  searchQuery,
  onSearchChange,
  sortType,
  onSortChange,
}: RepositoriesSearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-3"
    >
      <div className="relative flex-1">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          id="searchbar-input"
          type="text"
          placeholder="Rechercher un dépôt..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-violet-200/50 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all shadow-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            id="sort-dropdown"
            className="w-full md:w-auto px-4 py-2 cursor-pointer bg-slate-50 border border-violet-200/50 rounded-2xl text-slate-900 hover:bg-slate-100 hover:border-violet-300/50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <ArrowUpDown className="text-violet-600" size={18} />
            <span className="text-sm font-medium">
              {sortType === "added"
                ? "Date d'ajout"
                : sortType === "newest-commit"
                ? "Push récent"
                : "Push ancien"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[180px]">
            <DropdownMenuLabel>Trier par</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onSortChange("added")}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span>Date d'ajout</span>
                {sortType === "added" && (
                  <span className="text-violet-600">✓</span>
                )}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("newest-commit")}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span>Push le plus récent</span>
                {sortType === "newest-commit" && (
                  <span className="text-violet-600">✓</span>
                )}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("oldest-commit")}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span>Push le plus ancien</span>
                {sortType === "oldest-commit" && (
                  <span className="text-violet-600">✓</span>
                )}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
