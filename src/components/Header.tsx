import { Search, Bell, Menu, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoIcon from "@/assets/pooliverse-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { useSearch } from "@/hooks/useSearch";
import SearchOverlay from "@/components/SearchOverlay";

export default function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches
  } = useSearch();

  const handleSearchFocus = () => {
    setSearchOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToRecentSearches(query);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card card-shadow">
      <div className="container flex h-16 items-center gap-4 px-4">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
          <img src={logoIcon} alt="Pooliverse" className="h-8 w-8" />
          <span className="hidden sm:inline">Pooliverse</span>
        </Link>

        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search topics, campaigns, users..."
                className="pl-9 bg-background"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleSearchFocus}
              />
            </div>
          </form>
        </div>

        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          query={query}
          results={results}
          isSearching={isSearching}
          recentSearches={recentSearches}
          onRecentSearchClick={handleRecentSearchClick}
          onClearRecent={clearRecentSearches}
        />

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={signOut} className="hidden sm:flex">
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/onboarding")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
