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
import { useCampaigns } from "@/hooks/useCampaigns";
import { useSearch } from "@/hooks/useSearch";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample seed data
const samplePosts = [
  {
    id: "p-001",
    title: "School books fund for 60 children",
    category: "Education",
    body: "We need funds to buy school books and uniforms for 60 children in our community. The children are bright and eager to learn but lack essential materials. Your support will be used to purchase textbooks, writing materials, and uniforms.\n\nMany of these children walk miles to school every day, demonstrating their commitment to education. However, without proper materials, they struggle to keep up with their peers. This campaign aims to level the playing field and give every child an equal opportunity to succeed.\n\nThe funds will be distributed directly to local suppliers, and we will provide regular updates on purchases made. Every contribution, no matter how small, makes a real difference in a child's educational journey.",
    raised: 25400,
    goal: 100000,
    contributors: 62,
    days_left: 7,
    thumbnail: "DONATE",
    user: {
      name: "Amina O.",
      avatar: "avatar-1",
    },
    time: "2h",
  },
  {
    id: "p-002",
    title: "Community Health Clinic Equipment",
    category: "Health",
    body: "Our local health clinic serves over 2,000 families but lacks basic medical equipment. We're raising funds to purchase essential diagnostic tools and medical supplies that will enable our healthcare workers to provide better care.\n\nThe clinic currently operates with minimal resources, forcing many residents to travel long distances for basic medical attention. This campaign will help us acquire blood pressure monitors, thermometers, stethoscopes, and other vital equipment.",
    raised: 84200,
    goal: 150000,
    contributors: 143,
    days_left: 12,
    thumbnail: "PARTICIPATE",
    user: {
      name: "Dr. James K.",
      avatar: "avatar-1",
    },
    time: "5h",
  },
  {
    id: "p-003",
    title: "Women's Cooperative Sewing Workshop",
    category: "Agriculture",
    body: "Help us establish a sewing workshop for 25 women in our cooperative. This initiative will provide sustainable income for families and preserve traditional textile crafts.\n\nEach woman will receive training and access to professional sewing equipment. The workshop will produce school uniforms, traditional attire, and modern clothing for local markets.",
    raised: 45000,
    goal: 80000,
    contributors: 89,
    days_left: 15,
    thumbnail: "INVEST",
    user: {
      name: "Fatima A.",
      avatar: "avatar-1",
    },
    time: "1d",
  },
];

export default function Index() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 pb-20 lg:pb-6">
        {/* Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
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
            ) : campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <PostCard key={campaign.id} campaign={campaign} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No trending campaigns yet — be the first to start a pool!
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
