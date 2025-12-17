import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoIcon from "@/assets/jikota-logo.png";
import { useAuth } from "@/hooks/useAuth";

const getInitials = (name: string | null | undefined, email: string | null | undefined): string => {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
};

export default function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const fullName = user?.user_metadata?.full_name;
  const email = user?.email;
  const initials = getInitials(fullName, email);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card card-shadow">
      <div className="container flex h-16 items-center gap-4 px-4">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
          <img src={logoIcon} alt="Jikota" className="h-8 w-8" />
          <span className="hidden sm:inline">Jikota</span>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full p-0">
                  <Avatar className="h-9 w-9 border-2 border-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/onboarding")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
