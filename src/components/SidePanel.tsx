import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

const suggestedCampaigns = [
  { title: "Clean Water Initiative", category: "Health", contributors: 234 },
  { title: "Tech Skills Training", category: "Education", contributors: 189 },
  { title: "Market Renovation", category: "Infrastructure", contributors: 156 },
];

const categories = [
  "Education", "Health", "Infrastructure", "Technology", "Agriculture", "Arts"
];

const trendingTags = [
  "#CommunityFirst", "#ImpactMatters", "#TogetherWeRise", "#LocalHeroes"
];

interface SidePanelProps {
  onCreateClick: () => void;
}

export default function SidePanel({ onCreateClick }: SidePanelProps) {
  return (
    <aside className="hidden lg:block w-80 space-y-4">
      {/* Create CTA */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <h3 className="font-heading font-semibold mb-2">Start Your Campaign</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Turn your idea into reality with community support
        </p>
        <Button onClick={onCreateClick} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </Card>

      {/* Suggested Campaigns */}
      <Card className="p-4">
        <h3 className="font-heading font-semibold mb-3">Suggested Campaigns</h3>
        <div className="space-y-3">
          {suggestedCampaigns.map((campaign, index) => (
            <div key={index} className="group cursor-pointer">
              <p className="text-sm font-medium group-hover:text-primary transition-smooth">
                {campaign.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {campaign.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {campaign.contributors} contributors
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Categories */}
      <Card className="p-4">
        <h3 className="font-heading font-semibold mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              {category}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Trending Tags */}
      <Card className="p-4">
        <h3 className="font-heading font-semibold mb-3">Trending Tags</h3>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <span
              key={tag}
              className="text-sm text-primary hover:underline cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>
    </aside>
  );
}
