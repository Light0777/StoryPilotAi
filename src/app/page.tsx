"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ProblemSolution } from "@/components/landing/problem-solution";
import { UnlimitedStories } from "@/components/landing/unlimited-stories";
import { AICharacterEngine } from "@/components/landing/ai-character-engine";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AutoPublishing } from "@/components/landing/auto-publishing";
import { Features } from "@/components/landing/features";
import { FinalCTA } from "@/components/landing/final-cta";
import { FAQ } from "@/components/landing/faq";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.lagSmoothing(1);
    };
  }, []);

  return (
    <div className="bg-background">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <UnlimitedStories />
      <AICharacterEngine />
      <HowItWorks />
      <AutoPublishing />
      <Features />
      <FinalCTA />
      <FAQ />

      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">&copy; 2026 StoryPilot AI. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Twitter</span>
            <span>Docs</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
