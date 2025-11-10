import { useState } from "react";

export interface FilterState {
  categories: string[];
  tags: string[];
  amountRange?: { min: number; max: number };
}

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    tags: []
  });

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({ categories: [], tags: [] });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.tags.length > 0;

  return {
    filters,
    toggleCategory,
    toggleTag,
    clearFilters,
    hasActiveFilters
  };
}
