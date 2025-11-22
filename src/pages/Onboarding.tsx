import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, CheckCircle2, Users, Share2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/pooliverse-logo.png";
import { useAuth } from "@/hooks/useAuth";

const steps = [
  {
    title: "Welcome to Pooliverse",
    subtitle: "Discover, start, and support community campaigns",
    icon: Users,
    description: "Join thousands of people making a difference in their communities through collaborative crowdfunding.",
  },
  {
    title: "How it Works",
    subtitle: "Three simple steps to create impact",
    icon: Share2,
    steps: [
      { icon: Target, title: "Create", description: "Choose thumbnail, set goal, add milestones" },
      { icon: Share2, title: "Share", description: "Spread the word to your network" },
      { icon: CheckCircle2, title: "Deliver", description: "Release funds per milestone" },
    ],
  },
  {
    title: "Set Up Your Account",
    subtitle: "Connect payment & notifications",
    icon: CheckCircle2,
    form: true,
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState<"individual" | "corporate">("individual");
  const [isSignUp, setIsSignUp] = useState(true);
  
  // Corporate-specific fields
  const [businessName, setBusinessName] = useState("");
  const [cacRegNumber, setCacRegNumber] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  
  const navigate = useNavigate();
  const { user, signUp, signIn, loading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle authentication
      if (isSignUp) {
        const { error } = await signUp(
          email, 
          password, 
          fullName,
          username,
          userType,
          businessName,
          cacRegNumber,
          businessCategory
        );
        if (!error) {
          navigate("/");
        }
      } else {
        const { error } = await signIn(email, password);
        if (!error) {
          navigate("/");
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <img src={logoIcon} alt="Pooliverse" className="h-12 w-12" />
        <span className="font-heading font-bold text-2xl">Pooliverse</span>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-2xl p-8 animate-scale-in">
        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 rounded-full transition-all",
                index === currentStep
                  ? "w-8 bg-primary"
                  : index < currentStep
                  ? "w-2 bg-primary/60"
                  : "w-2 bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <StepIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-2">{step.title}</h1>
          <p className="text-muted-foreground">{step.subtitle}</p>
        </div>

        {/* Step 1: Welcome */}
        {currentStep === 0 && (
          <div className="text-center space-y-6">
            <p className="text-lg">{step.description}</p>
            <div className="flex gap-3 justify-center">
              <Button size="lg" onClick={handleNext}>
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={handleSkip}>
                Explore as Guest
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: How it Works */}
        {currentStep === 1 && step.steps && (
          <div className="space-y-6">
            <div className="grid gap-6">
              {step.steps.map((substep, index) => {
                const SubIcon = substep.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <SubIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold mb-1">
                        {substep.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {substep.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Setup / Authentication */}
        {currentStep === 2 && step.form && (
          <div className="space-y-6">
            <div className="flex justify-center gap-2 mb-4">
              <Button
                variant={isSignUp ? "default" : "outline"}
                onClick={() => setIsSignUp(true)}
                className="flex-1"
              >
                Sign Up
              </Button>
              <Button
                variant={!isSignUp ? "default" : "outline"}
                onClick={() => setIsSignUp(false)}
                className="flex-1"
              >
                Sign In
              </Button>
            </div>

            <div className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUserType("individual")}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all text-left",
                          userType === "individual"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="font-semibold">Individual</div>
                        <div className="text-sm text-muted-foreground">Personal campaigns</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserType("corporate")}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all text-left",
                          userType === "corporate"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="font-semibold">Corporate</div>
                        <div className="text-sm text-muted-foreground">Business campaigns</div>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{userType === "corporate" ? "Contact Person Name" : "Full Name"}</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={userType === "corporate" ? "John Doe" : "John Doe"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  {userType === "corporate" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          type="text"
                          placeholder="Acme Corporation"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cacRegNumber">CAC Registration Number</Label>
                        <Input
                          id="cacRegNumber"
                          type="text"
                          placeholder="RC1234567"
                          value={cacRegNumber}
                          onChange={(e) => setCacRegNumber(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessCategory">Business Category</Label>
                        <Select value={businessCategory} onValueChange={setBusinessCategory}>
                          <SelectTrigger id="businessCategory">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="agriculture">Agriculture</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="retail">Retail & E-commerce</SelectItem>
                            <SelectItem value="finance">Finance & Banking</SelectItem>
                            <SelectItem value="real-estate">Real Estate</SelectItem>
                            <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="energy">Energy & Utilities</SelectItem>
                            <SelectItem value="transport">Transportation & Logistics</SelectItem>
                            <SelectItem value="media">Media & Entertainment</SelectItem>
                            <SelectItem value="ngo">Non-Profit/NGO</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrev}>
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
          )}
          <Button
            className="flex-1"
            onClick={handleNext}
            disabled={loading || (currentStep === steps.length - 1 && (!email || !password))}
          >
            {currentStep === steps.length - 1 
              ? (isSignUp ? "Create Account" : "Sign In")
              : "Continue"}
            {currentStep < steps.length - 1 && <ChevronRight className="ml-2 h-5 w-5" />}
          </Button>
          {currentStep < steps.length - 1 && (
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
          )}
        </div>
      </Card>

      {/* Footer Note */}
      <p className="mt-6 text-sm text-muted-foreground text-center">
        Want to explore first?{" "}
        <button onClick={handleSkip} className="text-primary hover:underline">
          Continue as guest
        </button>
      </p>
    </div>
  );
}
