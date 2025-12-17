import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, TrendingUp, Info } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Campaign {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  image_url: string | null;
}

export default function PledgePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, title, description, target_amount, current_amount, image_url")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        toast({
          title: "Error",
          description: "Campaign not found",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setCampaign(data);
      setLoading(false);
    };

    fetchCampaign();
  }, [id, navigate]);

  const handlePledge = async () => {
    if (!amount || parseInt(amount) < 1000) {
      toast({
        title: "Invalid amount",
        description: "Minimum pledge is ₦1,000",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to pledge",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Mock pledge processing (no actual payment)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update campaign current_amount (tracks pledged amount for Invest campaigns)
      const newAmount = (campaign?.current_amount || 0) + parseInt(amount);
      const { error } = await supabase
        .from("campaigns")
        .update({ current_amount: newAmount })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Pledge recorded! 🎉",
        description: `You pledged ₦${parseInt(amount).toLocaleString()} - no money was deducted`,
      });

      navigate(`/campaign/${id}`);
    } catch (error: any) {
      toast({
        title: "Pledge failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!campaign) return null;

  const progressPercent = (campaign.current_amount / campaign.target_amount) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 pb-20 lg:pb-6 max-w-xl mx-auto">
        <Link
          to={`/campaign/${id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to campaign
        </Link>

        <Card className="p-6 space-y-6">
          <div>
            <h1 className="font-heading text-2xl font-bold mb-2">Pledge to Invest</h1>
            <p className="text-muted-foreground text-sm line-clamp-2">{campaign.title}</p>
          </div>

          {/* Important Notice */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This is a pledge of intent. <strong>No money will be deducted</strong> from your account. 
              This helps creators gauge interest and reach their funding goals.
            </AlertDescription>
          </Alert>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Pledged Amount</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="font-medium">₦{campaign.current_amount.toLocaleString()}</span>
              <span className="text-muted-foreground">of ₦{campaign.target_amount.toLocaleString()} goal</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Pledge Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1000}
            />
            <p className="text-xs text-muted-foreground">Minimum pledge: ₦1,000</p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {[10000, 50000, 100000, 250000, 500000].map((preset) => (
              <Button
                key={preset}
                variant={amount === String(preset) ? "default" : "outline"}
                size="sm"
                onClick={() => setAmount(String(preset))}
              >
                ₦{preset.toLocaleString()}
              </Button>
            ))}
          </div>

          {/* Pledge Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handlePledge}
            disabled={isProcessing || !amount}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Recording pledge...
              </>
            ) : (
              `Pledge ₦${amount ? parseInt(amount).toLocaleString() : "0"}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your pledge shows support — no payment required
          </p>
        </Card>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
