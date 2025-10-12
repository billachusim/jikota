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

interface PostCardProps {
  post: {
    id: string;
    title: string;
    category: string;
    body: string;
    raised: number;
    goal: number;
    contributors: number;
    days_left: number;
    thumbnail: string;
    user: {
      name: string;
      avatar: string;
    };
    time: string;
  };
}

const thumbnails = {
  PARTICIPATE: participateThumb,
  DONATE: donateThumb,
  INVEST: investThumb,
};

export default function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const progressPercent = (post.raised / post.goal) * 100;
  const truncatedBody = post.body.split("\n").slice(0, 6).join("\n");
  const needsTruncation = post.body.length > truncatedBody.length;

  const thumbnailSrc = thumbnails[post.thumbnail as keyof typeof thumbnails] || donateThumb;
  const avatarSrc = post.user.avatar === "avatar-1" ? avatar1 : avatar1;

  return (
    <article className="bg-card rounded-lg p-4 md:p-6 card-shadow hover:card-shadow-hover transition-smooth animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={avatarSrc}
            alt={post.user.name}
            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex flex-wrap items-center gap-2 text-sm min-w-0">
            <span className="font-medium truncate">{post.user.name}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground whitespace-nowrap">{post.time}</span>
            <Badge variant="secondary" className="shrink-0">
              {post.category}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <Link to={`/campaign/${post.id}`} className="block group">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnail */}
          <div className="w-full md:w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={thumbnailSrc}
              alt={post.thumbnail}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">
              {post.title}
            </h3>
            <p className="text-sm text-foreground/80 mb-3 whitespace-pre-wrap">
              {isExpanded ? post.body : truncatedBody}
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
            ₦{post.raised.toLocaleString()} raised
          </span>
          <span className="text-muted-foreground">
            of ₦{post.goal.toLocaleString()}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {post.contributors} contributors
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {post.days_left} days left
          </span>
        </div>

        {/* Contributors avatars */}
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 rounded-full border-2 border-card bg-muted -ml-2 first:ml-0"
            />
          ))}
          {post.contributors > 3 && (
            <span className="text-sm text-muted-foreground ml-1">
              +{post.contributors - 3}
            </span>
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
