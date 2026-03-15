import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, CheckCircle2, Users, Share2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/jikota-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";

const steps = [
  {
    title: "Welcome to Jikota",
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
        <img src={logoIcon} alt="Jikota" className="h-12 w-12" />
        <span className="font-heading font-bold text-2xl">Jikota</span>
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

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={async () => {
                  await lovable.auth.signInWithOAuth("google", {
                    redirect_uri: window.location.origin,
                  });
                }}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={async () => {
                  await lovable.auth.signInWithOAuth("apple", {
                    redirect_uri: window.location.origin,
                  });
                }}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </Button>
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
