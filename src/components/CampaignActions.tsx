import { MessageCircle, Heart, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCampaignInteractions } from "@/hooks/useCampaignInteractions";
import SocialShare from "@/components/SocialShare";
import { useNavigate } from "react-router-dom";

interface CampaignActionsProps {
  campaignId: string;
  campaignTitle: string;
  onQuote?: () => void;
}

export default function CampaignActions({ 
  campaignId, 
  campaignTitle,
  onQuote 
}: CampaignActionsProps) {
  const navigate = useNavigate();
  const {
    likesCount,
    commentsCount,
    isLiked,
    isBookmarked,
    toggleLike,
    toggleBookmark,
    loading,
  } = useCampaignInteractions(campaignId);

  const handleCommentClick = () => {
    navigate(`/campaign/${campaignId}#comments`);
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {/* Comment */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleCommentClick}
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        <span className="text-xs">{commentsCount}</span>
      </Button>

      {/* Quote/Mention */}
      {onQuote && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onQuote}
        >
          <span className="text-xs">Quote</span>
        </Button>
      )}

      {/* Like */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLike}
        disabled={loading}
        className={cn(isLiked && "text-primary")}
      >
        <Heart className={cn("h-4 w-4 mr-1", isLiked && "fill-current")} />
        <span className="text-xs">{likesCount}</span>
      </Button>

      {/* Bookmark/Follow */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleBookmark}
        disabled={loading}
        className={cn(isBookmarked && "text-primary")}
      >
        <Bookmark className={cn("h-4 w-4 mr-1", isBookmarked && "fill-current")} />
        <span className="text-xs">{isBookmarked ? "Saved" : "Save"}</span>
      </Button>

      {/* Share */}
      <SocialShare title={campaignTitle} />
    </div>
  );
}
