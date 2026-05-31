"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-content", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 40%", scrub: 1 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-16 sm:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute top-1/3 left-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="cta-content relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl">
          Launch Your First
          <br />
          AI Influencer Today.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          Create a character. Generate stories. Grow automatically.
        </p>

        <div className="mt-10">
          <SignUpButton mode="redirect">
            <Button className="rounded-xl bg-primary px-10 py-7 text-lg font-semibold text-primary-foreground shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] hover:bg-primary/90 hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300">
              Start Free
            </Button>
          </SignUpButton>
        </div>
      </div>
    </section>
  );
}
