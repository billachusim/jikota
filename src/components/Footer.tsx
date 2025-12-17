import { Link } from "react-router-dom";
import { Grid3x3, Mail, Bell, MessageCircle } from "lucide-react";

const footerLinks = [
  { icon: Grid3x3, label: "Categories", path: "/categories" },
  { icon: Mail, label: "Contact Us", path: "/contact" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
];

const additionalLinks = [
  { label: "About", path: "/about" },
  { label: "Terms", path: "/terms" },
  { label: "Privacy", path: "/privacy" },
  { label: "Help", path: "/help" },
];

export default function Footer() {
  return (
    <footer className="hidden lg:block border-t bg-card mt-12">
      <div className="container py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {footerLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-2 text-sm hover:text-primary transition-smooth"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Company</h3>
            <div className="grid grid-cols-2 gap-4">
              {additionalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm hover:text-primary transition-smooth"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Jikota. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
