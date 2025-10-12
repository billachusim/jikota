import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ads = [
  {
    id: 1,
    title: "Support Education Campaigns",
    description: "Help students across Nigeria access quality education",
    color: "from-primary/20 to-secondary/20",
  },
  {
    id: 2,
    title: "Health Initiatives Need You",
    description: "Join the fight for better healthcare in communities",
    color: "from-secondary/20 to-primary/20",
  },
  {
    id: 3,
    title: "Small Business Fund",
    description: "Invest in local entrepreneurs and watch them thrive",
    color: "from-primary/20 to-accent/20",
  },
];

export default function AdCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r card-shadow animate-fade-in">
      <div
        className={cn(
          "relative p-8 transition-all duration-500 bg-gradient-to-r",
          ads[currentIndex].color
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="max-w-2xl">
          <h3 className="text-xl font-heading font-semibold mb-2">
            {ads[currentIndex].title}
          </h3>
          <p className="text-muted-foreground">
            {ads[currentIndex].description}
          </p>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {ads.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  currentIndex === index ? "w-6 bg-primary" : "w-2 bg-primary/30"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
