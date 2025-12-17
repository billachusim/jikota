import { X, Search, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { SearchResult } from "@/hooks/useSearch";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  recentSearches: string[];
  onRecentSearchClick: (query: string) => void;
  onClearRecent: () => void;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  query,
  onQueryChange,
  results,
  isSearching,
  recentSearches,
  onRecentSearchClick,
  onClearRecent
}: SearchOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="container max-w-2xl pt-20">
        <div className="bg-card rounded-lg shadow-lg border">
          <div className="p-4 border-b">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search topics, campaigns, users..."
                className="pl-9 bg-background text-foreground"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-sm text-muted-foreground">
                {query ? "Search Results" : "Recent Searches"}
              </h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[500px]">
            <div className="p-4 space-y-4">
              {/* Loading State */}
              {isSearching && (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {!isSearching && query && results.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <TrendingUp className="h-4 w-4" />
                    <span>{results.length} results found</span>
                  </div>
                  {results.map(result => (
                    <button
                      key={result.id}
                      className="w-full text-left p-3 rounded-lg hover:bg-muted transition-smooth"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium">{result.title}</p>
                          {result.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.description}
                            </p>
                          )}
                          {result.category && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {result.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isSearching && query && results.length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium mb-1">No results found</p>
                  <p className="text-sm text-muted-foreground">
                    Try searching with different keywords
                  </p>
                </div>
              )}

              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Recent Searches</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearRecent}
                      className="text-xs"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => onRecentSearchClick(search)}
                        className="w-full text-left p-2 rounded-lg hover:bg-muted transition-smooth text-sm"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!query && recentSearches.length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium mb-1">Start searching</p>
                  <p className="text-sm text-muted-foreground">
                    Search for campaigns, users, or topics
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
