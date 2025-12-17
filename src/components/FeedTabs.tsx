import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "All" },
  { id: "Participate", label: "Participate" },
  { id: "Donate", label: "Donate" },
  { id: "Invest", label: "Invest" },
];

interface FeedTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-smooth",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "bg-card hover:bg-muted"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
