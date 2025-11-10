import { useState, useEffect } from "react";

export interface SearchResult {
  id: string;
  type: "campaign" | "user" | "tag";
  title: string;
  description?: string;
  category?: string;
  avatar?: string;
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    
    // Mock search - replace with real API call later
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockResults: SearchResult[] = [
      {
        id: "1",
        type: "campaign" as const,
        title: "School books fund for 60 children",
        description: "Education campaign",
        category: "Education"
      },
      {
        id: "2",
        type: "campaign" as const,
        title: "Clean Water Initiative",
        description: "Health campaign",
        category: "Health"
      },
      {
        id: "3",
        type: "user" as const,
        title: "Amina O.",
        description: "Campaign Creator"
      }
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setResults(mockResults);
    setIsSearching(false);
  };

  const addToRecentSearches = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches
  };
}
