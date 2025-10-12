import { Plus, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingFABProps {
  onCreateClick: () => void;
}

export default function FloatingFAB({ onCreateClick }: FloatingFABProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Create FAB */}
      <Button
        onClick={onCreateClick}
        size="lg"
        className="fixed bottom-20 left-4 lg:bottom-8 h-14 px-6 rounded-full shadow-lg hover:shadow-xl transition-smooth z-40 animate-scale-in"
      >
        <Plus className="h-5 w-5 mr-2" />
        <span className="hidden sm:inline">Create</span>
      </Button>

      {/* Scroll to Top */}
      <Button
        onClick={scrollToTop}
        size="icon"
        variant="secondary"
        className={cn(
          "fixed bottom-20 right-4 lg:bottom-8 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-smooth z-40",
          showScrollTop ? "opacity-100 scale-100" : "opacity-0 scale-0"
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </>
  );
}
