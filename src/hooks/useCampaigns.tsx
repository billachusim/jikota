import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Campaign = Tables<"campaigns">;
type Profile = Tables<"profiles">;
type Milestone = Tables<"milestones">;

export interface CampaignWithDetails extends Campaign {
  profiles: Profile | null;
  milestones: Milestone[];
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();

    // Set up realtime subscription
    const channel = supabase
      .channel('campaigns-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns'
        },
        () => {
          // Refetch campaigns when any change occurs
          fetchCampaigns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          profiles (*),
          milestones (*)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCampaigns(data as CampaignWithDetails[]);
    } catch (error: any) {
      toast({
        title: "Error loading campaigns",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { campaigns, loading, refetch: fetchCampaigns };
}
