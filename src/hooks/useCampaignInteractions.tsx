import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export function useCampaignInteractions(campaignId: string) {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCounts();
    if (user) {
      checkUserInteractions();
    }
  }, [campaignId, user]);

  const fetchCounts = async () => {
    // Fetch likes count
    const { count: likes } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("campaign_id", campaignId);
    
    setLikesCount(likes || 0);

    // Fetch comments count
    const { count: comments } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("campaign_id", campaignId);
    
    setCommentsCount(comments || 0);
  };

  const checkUserInteractions = async () => {
    if (!user) return;

    // Check if user liked
    const { data: likeData } = await supabase
      .from("likes")
      .select("id")
      .eq("campaign_id", campaignId)
      .eq("user_id", user.id)
      .maybeSingle();
    
    setIsLiked(!!likeData);

    // Check if user bookmarked
    const { data: bookmarkData } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("campaign_id", campaignId)
      .eq("user_id", user.id)
      .maybeSingle();
    
    setIsBookmarked(!!bookmarkData);
  };

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like campaigns",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    if (isLiked) {
      // Unlike
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("campaign_id", campaignId)
        .eq("user_id", user.id);
      
      if (!error) {
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      }
    } else {
      // Like
      const { error } = await supabase
        .from("likes")
        .insert({ campaign_id: campaignId, user_id: user.id });
      
      if (!error) {
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    }
    
    setLoading(false);
  };

  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark campaigns",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    if (isBookmarked) {
      // Remove bookmark
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("campaign_id", campaignId)
        .eq("user_id", user.id);
      
      if (!error) {
        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "Campaign removed from your bookmarks",
        });
      }
    } else {
      // Add bookmark
      const { error } = await supabase
        .from("bookmarks")
        .insert({ campaign_id: campaignId, user_id: user.id });
      
      if (!error) {
        setIsBookmarked(true);
        toast({
          title: "Bookmarked",
          description: "Campaign saved to your bookmarks",
        });
      }
    }
    
    setLoading(false);
  };

  return {
    likesCount,
    commentsCount,
    isLiked,
    isBookmarked,
    toggleLike,
    toggleBookmark,
    loading,
  };
}
