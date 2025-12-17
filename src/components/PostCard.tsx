import { useState } from "react";
import { MoreVertical, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import donateThumb from "@/assets/donate-thumbnail.png";
import avatar1 from "@/assets/avatar-1.png";
import { CampaignWithDetails } from "@/hooks/useCampaigns";
import { formatDistanceToNow } from "date-fns";
import CampaignActions from "@/components/CampaignActions";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PostCardProps {
  campaign: CampaignWithDetails;
}

export default function PostCard({ campaign }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  
  const progressPercent = (campaign.current_amount / campaign.target_amount) * 100;
  const truncatedBody = campaign.description.split("\n").slice(0, 6).join("\n");
  const needsTruncation = campaign.description.length > truncatedBody.length;

  const thumbnailSrc = donateThumb;
  const avatarSrc = campaign.profiles?.avatar_url || avatar1;
  const timeAgo = formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true });

  const handleQuote = () => {
    setQuoteText(`"${campaign.title}"\n\n`);
    setQuoteModalOpen(true);
  };

  // Determine CTA button based on category
  const getCTAButton = () => {
    if (campaign.category === "Donate") {
      return (
        <Link to={`/campaign/${campaign.id}/donate`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            CLICK TO DONATE
          </Button>
        </Link>
      );
    }
    if (campaign.category === "Invest") {
      return (
        <Link to={`/campaign/${campaign.id}/pledge`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            CLICK TO INVEST
          </Button>
        </Link>
      );
    }
    return null;
  };

  return (
    <>
      <article className="bg-card rounded-lg p-4 md:p-6 card-shadow hover:card-shadow-hover transition-smooth animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={avatarSrc}
            alt={campaign.profiles?.full_name || "User"}
            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex flex-wrap items-center gap-2 text-sm min-w-0">
            <span className="font-medium truncate">{campaign.profiles?.full_name || "Anonymous"}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground whitespace-nowrap">{timeAgo}</span>
            <Badge variant="secondary" className="shrink-0">
              {campaign.category}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Location */}
      {campaign.location && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="h-3 w-3" />
          <span>{campaign.location}</span>
        </div>
      )}

      <Link to={`/campaign/${campaign.id}`} className="block group">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnail */}
          <div className="w-full md:w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={campaign.image_url || thumbnailSrc}
              alt={campaign.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">
              {campaign.title}
            </h3>
            <p className="text-sm text-foreground/80 mb-3 whitespace-pre-wrap">
              {isExpanded ? campaign.description : truncatedBody}
              {needsTruncation && !isExpanded && "…"}
              {needsTruncation && !isExpanded && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsExpanded(true);
                  }}
                  className="ml-1 text-primary hover:underline font-medium"
                >
                  read more
                </button>
              )}
            </p>
          </div>
        </div>
      </Link>

      {/* Progress - Hide for Participate category */}
      {campaign.category !== "Participate" && (
        <div className="mt-4 space-y-2">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                ₦{campaign.current_amount.toLocaleString()} {campaign.category === "Invest" ? "pledged" : "raised"}
              </span>
              <span className="text-muted-foreground">
                of ₦{campaign.target_amount.toLocaleString()}
              </span>
              {campaign.milestones && campaign.milestones.length > 0 && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {campaign.milestones.filter(m => m.completed).length} of {campaign.milestones.length} milestones
                  </span>
                </>
              )}
            </div>
            {/* CTA Button */}
            {getCTAButton()}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4">
        <CampaignActions 
          campaignId={campaign.id} 
          campaignTitle={campaign.title}
          onQuote={handleQuote}
        />
      </div>
    </article>

    {/* Quote Modal */}
    <Dialog open={quoteModalOpen} onOpenChange={setQuoteModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quote Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            placeholder="Add your thoughts..."
            className="min-h-[150px]"
          />
          <Button onClick={() => setQuoteModalOpen(false)} className="w-full">
            Share Quote
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
