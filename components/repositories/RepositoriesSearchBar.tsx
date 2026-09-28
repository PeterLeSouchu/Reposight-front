"use client";

import { Search, ArrowUpDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortType = "added" | "oldest-commit" | "newest-commit";

const SORT_OPTIONS: { value: SortType; label: string; short: string }[] = [
  { value: "added", label: "Date d'ajout", short: "Date d'ajout" },
  { value: "newest-commit", label: "Push le plus récent", short: "Push récent" },
  { value: "oldest-commit", label: "Push le plus ancien", short: "Push ancien" },
];

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
  const currentSort = SORT_OPTIONS.find((option) => option.value === sortType);

  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
          size={18}
        />
        <input
          id="searchbar-input"
          type="text"
          placeholder="Rechercher un dépôt…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 w-full rounded-full border border-iris-200 bg-white pl-11 pr-4 text-ink shadow-[0_1px_2px_rgba(42,14,87,0.04)] transition-[border-color,box-shadow] placeholder:text-ink/40 hover:border-iris-300 focus:border-iris-400 focus:outline-none focus:ring-4 focus:ring-iris-200/60"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          id="sort-dropdown"
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-iris-200 bg-white px-5 text-sm font-medium text-ink transition-colors hover:border-iris-300 hover:bg-iris-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-500"
        >
          <ArrowUpDown className="text-iris-600" size={16} />
          {currentSort?.short}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuLabel className="text-xs font-medium text-ink/50">
            Trier par
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className="justify-between"
            >
              {option.label}
              {sortType === option.value && (
                <Check size={14} className="text-iris-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
