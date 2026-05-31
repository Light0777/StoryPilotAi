"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function UnlimitedStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(stackRef.current, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 30%", scrub: 1 },
      });

      gsap.to(stackRef.current, {
        y: -30, scale: 1.02,
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden px-6 py-16 sm:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="max-w-2xl">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            One Character.
            <br />
            <span className="text-primary">Unlimited Stories.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            StoryPilot AI creates an endless stream of story content while maintaining character consistency narrative, and visual identity across every post.
          </p>
        </div>

        <div ref={stackRef} className="mt-16">
          <img
            src="/assets/StoryPilot AI _ Centered Floating Story Stack.png"
            alt="Floating Story Stack"
            className="h-auto w-full rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
