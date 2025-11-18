import { useState } from "react";
import { MessageCircle, Share2, AtSign, Heart, UserPlus, Send, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import participateThumb from "@/assets/participate-thumbnail.png";
import donateThumb from "@/assets/donate-thumbnail.png";
import investThumb from "@/assets/invest-thumbnail.png";
import avatar1 from "@/assets/avatar-1.png";
import { CampaignWithDetails } from "@/hooks/useCampaigns";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  campaign: CampaignWithDetails;
}

const thumbnails = {
  PARTICIPATE: participateThumb,
  DONATE: donateThumb,
  INVEST: investThumb,
};

export default function PostCard({ campaign }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const progressPercent = (campaign.current_amount / campaign.target_amount) * 100;
  const truncatedBody = campaign.description.split("\n").slice(0, 6).join("\n");
  const needsTruncation = campaign.description.length > truncatedBody.length;

  const thumbnailSrc = donateThumb; // Default thumbnail for now
  const avatarSrc = campaign.profiles?.avatar_url || avatar1;
  const timeAgo = formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true });

  return (
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

      {/* Progress */}
      <div className="mt-4 space-y-2">
        <Progress value={progressPercent} className="h-2" />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">
            ₦{campaign.current_amount.toLocaleString()} raised
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
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-1">
        <Button variant="ghost" size="sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          <span className="text-xs">42</span>
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          <span className="text-xs">Share</span>
        </Button>
        <Button variant="ghost" size="sm">
          <AtSign className="h-4 w-4 mr-1" />
          <span className="text-xs">Mention</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className={cn(isLiked && "text-primary")}
        >
          <Heart className={cn("h-4 w-4 mr-1", isLiked && "fill-current")} />
          <span className="text-xs">{isLiked ? "156" : "155"}</span>
        </Button>
        <Button variant="ghost" size="sm">
          <UserPlus className="h-4 w-4 mr-1" />
          <span className="text-xs">Follow</span>
        </Button>
        <Button variant="ghost" size="sm">
          <Send className="h-4 w-4 mr-1" />
          <span className="text-xs">Send</span>
        </Button>
      </div>
    </article>
  );
}
