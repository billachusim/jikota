import { useState } from "react";
import Header from "@/components/Header";
import AdCarousel from "@/components/AdCarousel";
import PostCard from "@/components/PostCard";
import SidePanel from "@/components/SidePanel";
import CreatePostModal from "@/components/CreatePostModal";
import FloatingFAB from "@/components/FloatingFAB";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import SearchOverlay from "@/components/SearchOverlay";
import FeedTabs from "@/components/FeedTabs";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useSearch } from "@/hooks/useSearch";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Index() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { campaigns, loading } = useCampaigns();
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

  // Filter campaigns based on active tab
  const filteredCampaigns = activeTab === "all"
    ? campaigns
    : campaigns.filter((c) => c.category === activeTab);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 pb-20 lg:pb-6">
        {/* Search Bar */}
        <div className="mb-4 max-w-2xl mx-auto">
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

        {/* Category Filter Tabs */}
        <div className="mb-6 max-w-2xl mx-auto">
          <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
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

        {/* Ad Carousel */}
        <div className="mb-6">
          <AdCarousel />
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Feed */}
          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <PostCard key={campaign.id} campaign={campaign} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all" 
                    ? "No campaigns yet — be the first to start one!"
                    : `No ${activeTab} campaigns yet`}
                </p>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <SidePanel onCreateClick={() => setIsCreateModalOpen(true)} />
        </div>
      </main>

      <Footer />
      <BottomNav />
      <FloatingFAB onCreateClick={() => setIsCreateModalOpen(true)} />
      <CreatePostModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
