import { useState } from "react";
import { X, Plus, Calendar } from "lucide-react";
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
import participateThumb from "@/assets/participate-thumbnail.png";
import donateThumb from "@/assets/donate-thumbnail.png";
import investThumb from "@/assets/invest-thumbnail.png";

const thumbnails = [
  {
    id: "PARTICIPATE",
    label: "Participate",
    description: "Hands-on involvement",
    image: participateThumb,
  },
  {
    id: "DONATE",
    label: "Donate",
    description: "Financial contribution",
    image: donateThumb,
  },
  {
    id: "INVEST",
    label: "Invest",
    description: "Growth opportunity",
    image: investThumb,
  },
];

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [selectedThumbnail, setSelectedThumbnail] = useState("DONATE");
  const [milestones, setMilestones] = useState<Array<{ title: string; amount: string; date: string }>>([]);

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amount: "", date: "" }]);
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
            <Label htmlFor="title">Campaign Title</Label>
            <Input id="title" placeholder="Enter a compelling title" />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
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
          </div>

          {/* Goal & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Funding Goal (₦)</Label>
              <Input id="goal" type="number" placeholder="100000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <div className="relative">
                <Input id="deadline" type="date" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Campaign Description</Label>
            <Textarea
              id="body"
              placeholder="Tell your story and explain how funds will be used..."
              className="min-h-32"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Be specific about your goals and how the funds will make an impact
            </p>
          </div>

          {/* Milestones */}
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
                {milestones.map((_, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <Input placeholder="Milestone title" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Amount (₦)" type="number" />
                      <Input type="date" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              💡 Tip: Add milestones to build trust — donors can release funds per milestone
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Save Draft
            </Button>
            <Button variant="outline" className="flex-1">
              Preview
            </Button>
            <Button className="flex-1">
              Publish Campaign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
