import { Search, Bell, Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoIcon from "@/assets/pooliverse-logo.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card card-shadow">
      <div className="container flex h-16 items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
          <img src={logoIcon} alt="Pooliverse" className="h-8 w-8" />
          <span className="hidden sm:inline">Pooliverse</span>
        </Link>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search topics, campaigns, users..."
              className="pl-9 bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
