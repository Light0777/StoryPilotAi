"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3 });
  }, []);

  return (
    <>
      <header ref={navRef} className="fixed top-0 right-0 left-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <img src="/assets/favicon.png" alt="StoryPilot" className="h-6 w-6" />
            <span className="text-lg font-semibold tracking-tight text-foreground">StoryPilot</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/sign-in"
              className="hidden rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-block"
            >
              Sign In
            </a>
            <a
              href="/sign-up"
              className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:inline-block"
            >
              Start Free
            </a>
            <button
              type="button"
              className="flex items-center md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col gap-6 bg-black px-6 pt-24 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Close <X className="h-5 w-5" />
          </button>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-3xl font-extrabold text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-6 flex flex-col items-start gap-4">
            <a
              href="/sign-up"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start Free
            </a>
            <a
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </a>
          </div>
        </div>
      )}
    </>
  );
}
