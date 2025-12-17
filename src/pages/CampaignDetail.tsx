import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Calendar, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import Comments from "@/components/Comments";
import CampaignActions from "@/components/CampaignActions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import donateThumb from "@/assets/donate-thumbnail.png";
import avatar1 from "@/assets/avatar-1.png";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

const presetAmounts = [1000, 2500, 5000, 10000];

export default function CampaignDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Fetch campaign data
  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          profiles(*),
          milestones(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (location.hash === "#comments") {
      setTimeout(() => {
        document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-6 pb-20 lg:pb-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <BottomNav />
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-6 pb-20 lg:pb-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Campaign not found</h2>
            <p className="text-muted-foreground mb-4">The campaign you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>Back to Feed</Button>
            </Link>
          </div>
        </main>
        <BottomNav />
        <Footer />
      </div>
    );
  }

  const progressPercent = campaign.target_amount > 0 ? (campaign.current_amount / campaign.target_amount) * 100 : 0;
  const activeAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  const platformFee = Math.round(activeAmount * 0.025);
  const totalAmount = activeAmount + platformFee;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 pb-20 lg:pb-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={campaign.image_url || donateThumb}
                alt={campaign.title}
                className="w-full h-64 object-cover"
              />
              <Badge className="absolute top-4 left-4">
                {campaign.category}
              </Badge>
            </div>

            {/* Title & Creator */}
            <div>
              <h1 className="font-heading text-3xl font-bold mb-3">
                {campaign.title}
              </h1>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={campaign.profiles?.avatar_url || avatar1} />
                  <AvatarFallback>
                    {campaign.profiles?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {campaign.profiles?.full_name || "Anonymous"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress - Show only for non-Participate campaigns */}
            {campaign.category !== "Participate" && (
              <Card className="p-6">
                <Progress value={progressPercent} className="h-3 mb-4" />
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div>
                    <p className="text-2xl font-bold">
                      ₦{campaign.current_amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      raised of ₦{campaign.target_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <CampaignActions 
                    campaignId={campaign.id}
                    campaignTitle={campaign.title}
                  />
                </div>
              </Card>
            )}

            {/* Engagement for Participate */}
            {campaign.category === "Participate" && (
              <Card className="p-6">
                <CampaignActions 
                  campaignId={campaign.id} 
                  campaignTitle={campaign.title}
                />
              </Card>
            )}

            {/* Description */}
            <Card className="p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">
                {campaign.category === "Participate" ? "Discussion" : "About this campaign"}
              </h2>
              <p className="whitespace-pre-wrap text-foreground/90">
                {campaign.description}
              </p>
            </Card>

            {/* Milestones - Show only for non-Participate campaigns */}
            {campaign.category !== "Participate" && campaign.milestones && campaign.milestones.length > 0 && (
              <Card className="p-6">
                <h2 className="font-heading text-xl font-semibold mb-4">
                  Milestones
                </h2>
                <div className="space-y-4">
                  {campaign.milestones.map((milestone: any, index: number) => (
                    <div
                      key={milestone.id || index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle2
                          className={
                            milestone.completed
                              ? "h-5 w-5 text-primary"
                              : "h-5 w-5 text-muted-foreground"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{milestone.title}</p>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                          <span>₦{milestone.amount.toLocaleString()}</span>
                          <span>·</span>
                          <span>{new Date(milestone.target_date).toLocaleDateString()}</span>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  💡 Funds held until milestone 1 is verified
                </p>
              </Card>
            )}

            {/* Campaign Updates */}
            <Card className="p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">
                Campaign Updates
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3 pb-4 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={campaign.profiles?.avatar_url || avatar1} />
                    <AvatarFallback>
                      {campaign.profiles?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{campaign.profiles?.full_name || "Anonymous"}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 mb-2">
                      Campaign created
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <Card className="p-6" id="comments">
              <Comments campaignId={campaign.id} />
            </Card>
          </div>

          {/* Donation Widget - Show only for non-Participate campaigns */}
          {campaign.category !== "Participate" && (
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <h3 className="font-heading text-lg font-semibold mb-4">
                  Make a Contribution
                </h3>

                {/* Preset Amounts */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                    >
                      ₦{amount.toLocaleString()}
                    </Button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="custom-amount">Custom Amount (₦)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                  />
                </div>

                {/* Anonymous */}
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="anonymous">Contribute anonymously</Label>
                  <Switch
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>

                {/* Fee Breakdown */}
                {activeAmount > 0 && (
                  <div className="bg-muted/50 rounded-lg p-3 mb-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Your contribution</span>
                      <span>₦{activeAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform fee (2.5%)</span>
                      <span>₦{platformFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-1 mt-1 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  disabled={activeAmount === 0}
                >
                  Contribute ₦{activeAmount.toLocaleString()}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  Secure payment powered by Jikota
                </p>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
