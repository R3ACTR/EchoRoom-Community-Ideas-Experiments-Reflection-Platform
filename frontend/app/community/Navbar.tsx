"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/ideas", label: "Ideas" },
  { to: "/experiments", label: "Experiments" },
  { to: "/reflection", label: "Reflection" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">EchoRoom</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`transition-colors hover:text-primary ${
                pathname === link.to ? "text-primary" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/community" className="hidden md:inline-flex">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-md">
              Join Community
            </button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-background pb-4">
          <div className="container flex flex-col space-y-3 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/community" onClick={() => setMobileOpen(false)}>
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-md">
                Join Community
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
