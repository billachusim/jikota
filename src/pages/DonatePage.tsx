import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, CreditCard, Wallet } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export default function DonatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
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

  const handleDonate = async () => {
    if (!amount || parseInt(amount) < 100) {
      toast({
        title: "Invalid amount",
        description: "Minimum donation is ₦100",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to donate",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Mock payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update campaign current_amount
      const newAmount = (campaign?.current_amount || 0) + parseInt(amount);
      const { error } = await supabase
        .from("campaigns")
        .update({ current_amount: newAmount })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Donation successful! 🎉",
        description: `Thank you for donating ₦${parseInt(amount).toLocaleString()}`,
      });

      navigate(`/campaign/${id}`);
    } catch (error: any) {
      toast({
        title: "Payment failed",
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
            <h1 className="font-heading text-2xl font-bold mb-2">Donate to Campaign</h1>
            <p className="text-muted-foreground text-sm line-clamp-2">{campaign.title}</p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="font-medium">₦{campaign.current_amount.toLocaleString()}</span>
              <span className="text-muted-foreground">of ₦{campaign.target_amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={100}
            />
            <p className="text-xs text-muted-foreground">Minimum donation: ₦100</p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {[1000, 5000, 10000, 25000, 50000].map((preset) => (
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

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-4 w-4" />
                  Card Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Wallet className="h-4 w-4" />
                  Bank Transfer
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Donate Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleDonate}
            disabled={isProcessing || !amount}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Donate ₦${amount ? parseInt(amount).toLocaleString() : "0"}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your payment is secure and encrypted
          </p>
        </Card>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
