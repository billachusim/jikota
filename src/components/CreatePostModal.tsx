import { useState, useEffect } from "react";
import { X, Plus, Calendar, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import participateThumb from "@/assets/participate-thumbnail.png";
import donateThumb from "@/assets/donate-thumbnail.png";
import investThumb from "@/assets/invest-thumbnail.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const thumbnails = [
  {
    id: "PARTICIPATE",
    label: "Participate",
    description: "Start a discussion",
    image: participateThumb,
  },
  {
    id: "DONATE",
    label: "Donate",
    description: "Request donations",
    image: donateThumb,
  },
  {
    id: "INVEST",
    label: "Invest",
    description: "Seek investment",
    image: investThumb,
  },
];

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [selectedThumbnail, setSelectedThumbnail] = useState("DONATE");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [body, setBody] = useState("");
  const [milestones, setMilestones] = useState<Array<{ title: string; amount: string; date: string }>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  // Auto-save to localStorage
  useEffect(() => {
    if (title || body) {
      const draft = { title, category, goal, deadline, body, selectedThumbnail, milestones };
      localStorage.setItem("campaignDraft", JSON.stringify(draft));
    }
  }, [title, category, goal, deadline, body, selectedThumbnail, milestones]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("campaignDraft");
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title || "");
      setCategory(draft.category || "");
      setGoal(draft.goal || "");
      setDeadline(draft.deadline || "");
      setBody(draft.body || "");
      setSelectedThumbnail(draft.selectedThumbnail || "DONATE");
      setMilestones(draft.milestones || []);
    }
  }, []);

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amount: "", date: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    else if (title.length > 100) newErrors.title = "Title must be under 100 characters";

    if (!category) newErrors.category = "Category is required";

    // Only validate funding goal and deadline for non-Participate campaigns
    if (selectedThumbnail !== "PARTICIPATE") {
      if (!goal) newErrors.goal = "Funding goal is required";
      else if (parseInt(goal) < 1000) newErrors.goal = "Goal must be at least ₦1,000";

      if (!deadline) newErrors.deadline = "Deadline is required";
      else if (new Date(deadline) <= new Date()) newErrors.deadline = "Deadline must be in the future";
    }

    if (!body.trim()) newErrors.body = "Description is required";
    else if (body.length < 100) newErrors.body = "Description must be at least 100 characters";
    else if (body.length > 5000) newErrors.body = "Description must be under 5000 characters";

    // Validate milestones only for non-Participate campaigns
    if (selectedThumbnail !== "PARTICIPATE") {
      milestones.forEach((milestone, index) => {
        if (milestone.title && !milestone.amount) {
          newErrors[`milestone_${index}_amount`] = "Amount required";
        }
        if (milestone.amount && parseInt(milestone.amount) > parseInt(goal)) {
          newErrors[`milestone_${index}_amount`] = "Cannot exceed total goal";
        }
        if (index > 0 && milestone.date) {
          const prevDate = new Date(milestones[index - 1].date);
          const currentDate = new Date(milestone.date);
          if (currentDate <= prevDate) {
            newErrors[`milestone_${index}_date`] = "Must be after previous milestone";
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your campaign has been saved locally"
    });
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation failed",
        description: "Please fix the errors before publishing",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a campaign.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Insert campaign
      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .insert({
          title,
          category: selectedThumbnail === "PARTICIPATE" ? "Participate" : category,
          description: body,
          target_amount: selectedThumbnail === "PARTICIPATE" ? 0 : parseFloat(goal),
          user_id: user.id,
          status: "active",
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Insert milestones only for non-Participate campaigns
      if (selectedThumbnail !== "PARTICIPATE" && milestones.length > 0 && campaign) {
        const milestonesData = milestones.map((m) => ({
          campaign_id: campaign.id,
          title: m.title,
          amount: parseFloat(m.amount),
          target_date: m.date,
        }));

        const { error: milestonesError } = await supabase
          .from("milestones")
          .insert(milestonesData);

        if (milestonesError) throw milestonesError;
      }

      // Clear the draft and form
      localStorage.removeItem("campaignDraft");
      setTitle("");
      setCategory("");
      setGoal("");
      setDeadline("");
      setBody("");
      setMilestones([]);
      setSelectedThumbnail("DONATE");
      
      toast({
        title: "Campaign published!",
        description: "Your campaign is now live"
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Create Campaign</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Thumbnail Selection */}
          <div className="space-y-3">
            <Label>Choose Campaign Type</Label>
            <div className="grid grid-cols-3 gap-3">
              {thumbnails.map((thumb) => (
                <button
                  key={thumb.id}
                  onClick={() => setSelectedThumbnail(thumb.id)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-smooth text-left",
                    selectedThumbnail === thumb.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <img
                    src={thumb.image}
                    alt={thumb.label}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <p className="font-medium text-sm">{thumb.label}</p>
                  <p className="text-xs text-muted-foreground">{thumb.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              placeholder="Enter a compelling title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className={errors.title ? "border-destructive" : ""}
            />
            <div className="flex justify-between">
              {errors.title && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.title}
                </p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {title.length}/100
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="arts">Arts & Culture</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Goal & Deadline - Only show for non-Participate campaigns */}
          {selectedThumbnail !== "PARTICIPATE" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Funding Goal (₦) *</Label>
                <Input
                  id="goal"
                  type="number"
                  placeholder="100000"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className={errors.goal ? "border-destructive" : ""}
                />
                {errors.goal && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.goal}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <div className="relative">
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={errors.deadline ? "border-destructive" : ""}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {errors.deadline && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.deadline}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">
              {selectedThumbnail === "PARTICIPATE" ? "Discussion Post *" : "Campaign Description *"}
            </Label>
            <Textarea
              id="body"
              placeholder={
                selectedThumbnail === "PARTICIPATE" 
                  ? "Share your thoughts, ask questions, or start a discussion..."
                  : "Tell your story and explain how funds will be used..."
              }
              className={cn("min-h-32", errors.body && "border-destructive")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={5000}
            />
            <div className="flex justify-between">
              {errors.body && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.body}
                </p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {body.length}/5000 characters (min 100)
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedThumbnail === "PARTICIPATE" 
                ? "💡 Tip: Be clear and engaging to encourage discussion"
                : "💡 Tip: Be specific about your goals and how the funds will make an impact"}
            </p>
          </div>

          {/* Milestones - Only show for non-Participate campaigns */}
          {selectedThumbnail !== "PARTICIPATE" && (
            <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Milestones (Optional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                <Plus className="h-4 w-4 mr-1" />
                Add Milestone
              </Button>
            </div>
            
            {milestones.length > 0 && (
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Milestone {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Milestone title"
                      value={milestone.title}
                      onChange={(e) => {
                        const updated = [...milestones];
                        updated[index].title = e.target.value;
                        setMilestones(updated);
                      }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          placeholder="Amount (₦)"
                          type="number"
                          value={milestone.amount}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[index].amount = e.target.value;
                            setMilestones(updated);
                          }}
                          className={errors[`milestone_${index}_amount`] ? "border-destructive" : ""}
                        />
                        {errors[`milestone_${index}_amount`] && (
                          <p className="text-xs text-destructive mt-1">
                            {errors[`milestone_${index}_amount`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Input
                          type="date"
                          value={milestone.date}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[index].date = e.target.value;
                            setMilestones(updated);
                          }}
                          className={errors[`milestone_${index}_date`] ? "border-destructive" : ""}
                        />
                        {errors[`milestone_${index}_date`] && (
                          <p className="text-xs text-destructive mt-1">
                            {errors[`milestone_${index}_date`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              💡 Tip: Add milestones to build trust — donors can release funds per milestone
            </p>
          </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button variant="outline" className="flex-1" onClick={validateForm}>
              Preview
            </Button>
            <Button className="flex-1" onClick={handlePublish} disabled={isSaving}>
              {isSaving 
                ? "Publishing..." 
                : selectedThumbnail === "PARTICIPATE" 
                  ? "Publish Post" 
                  : "Publish Campaign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
