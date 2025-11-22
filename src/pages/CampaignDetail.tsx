import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, CheckCircle2, Calendar } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import SocialShare from "@/components/SocialShare";
import Comments from "@/components/Comments";
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

const presetAmounts = [1000, 2500, 5000, 10000];

const milestones = [
  { title: "Purchase textbooks", amount: 40000, date: "Nov 15, 2025", completed: false },
  { title: "Buy uniforms", amount: 35000, date: "Nov 30, 2025", completed: false },
  { title: "Writing materials", amount: 25000, date: "Dec 15, 2025", completed: false },
];

export default function CampaignDetail() {
  const { id } = useParams();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Sample campaign data
  const campaign = {
    id: id || "p-001",
    title: "School books fund for 60 children",
    category: "Education",
    body: "We need funds to buy school books and uniforms for 60 children in our community. The children are bright and eager to learn but lack essential materials. Your support will be used to purchase textbooks, writing materials, and uniforms.\n\nMany of these children walk miles to school every day, demonstrating their commitment to education. However, without proper materials, they struggle to keep up with their peers. This campaign aims to level the playing field and give every child an equal opportunity to succeed.\n\nThe funds will be distributed directly to local suppliers, and we will provide regular updates on purchases made. Every contribution, no matter how small, makes a real difference in a child's educational journey.",
    raised: 25400,
    goal: 100000,
    contributors: 62,
    days_left: 7,
    thumbnail: donateThumb,
    user: {
      name: "Amina O.",
      avatar: avatar1,
      verified: true,
    },
  };

  const progressPercent = (campaign.raised / campaign.goal) * 100;
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
                src={campaign.thumbnail}
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
                <img
                  src={campaign.user.avatar}
                  alt={campaign.user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {campaign.user.name}
                    {campaign.user.verified && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Campaign Creator</p>
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
                      ₦{campaign.raised.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      raised of ₦{campaign.goal.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-2xl font-bold">{campaign.contributors}</p>
                    <p className="text-sm text-muted-foreground">contributors</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-2xl font-bold">{campaign.days_left}</p>
                    <p className="text-sm text-muted-foreground">days left</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={isLiked ? "fill-current text-primary" : ""} />
                  </Button>
                  <SocialShare title={campaign.title} />
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Engagement for Participate */}
            {campaign.category === "Participate" && (
              <Card className="p-6">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={isLiked ? "fill-current text-primary" : ""} />
                  </Button>
                  <SocialShare title={campaign.title} />
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Description */}
            <Card className="p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">
                About this campaign
              </h2>
              <p className="whitespace-pre-wrap text-foreground/90">
                {campaign.body}
              </p>
            </Card>

            {/* Milestones - Show only for non-Participate campaigns */}
            {campaign.category !== "Participate" && (
              <Card className="p-6">
                <h2 className="font-heading text-xl font-semibold mb-4">
                  Milestones
                </h2>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
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
                          <span>{milestone.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  💡 Funds held until milestone 1 is verified
                </p>
              </Card>
            )}

            {/* Updates Timeline */}
            <Card className="p-6">
              <h2 className="font-heading text-xl font-semibold mb-4">
                Campaign Updates
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3 pb-4 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={campaign.user.avatar} />
                    <AvatarFallback>AO</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{campaign.user.name}</p>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm text-foreground/90 mb-2">
                      Thank you all for the amazing support! We've reached 25% of our goal in just one week. Your contributions are making a real difference.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Nov 8, 2025</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={campaign.user.avatar} />
                    <AvatarFallback>AO</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{campaign.user.name}</p>
                      <span className="text-xs text-muted-foreground">5 days ago</span>
                    </div>
                    <p className="text-sm text-foreground/90 mb-2">
                      Campaign launched! We're excited to bring educational materials to children in need. Every contribution counts!
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Nov 5, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <Card className="p-6">
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
                  Secure payment powered by Pooliverse
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
