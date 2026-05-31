"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User, Sparkles, Upload, Smartphone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const nodes = [
  { label: "Character", icon: User },
  { label: "Story Generation", icon: Sparkles },
  { label: "Buffer", icon: Upload },
  { label: "Instagram", icon: Smartphone },
];

export function AutoPublishing() {
  const sectionRef = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".flow-node", { y: 40, opacity: 0, scale: 0.9 }, {
        y: 0, opacity: 1, scale: 1, stagger: 0.2, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", end: "center center", scrub: 1 },
      });

      if (flowRef.current) {
        gsap.to(flowRef.current, {
          backgroundPosition: "200% 0",
          repeat: -1,
          duration: 2,
          ease: "linear",
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-6 py-16 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          From Idea To Story.
          <br />
          <span className="text-primary">Automatically.</span>
        </h2>

        <div className="mt-20 grid grid-cols-2 items-center gap-8 sm:grid-cols-4">
          {nodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <div key={node.label}>
                <div className="flow-node mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-card shadow-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{node.label}</p>
                {i < nodes.length - 1 && (
                  <div className="mt-3 text-center">
                    <div className="mx-auto h-px w-8 animate-pulse bg-primary/50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-16 text-base text-muted-foreground">
          Your character&apos;s story goes from concept to Instagram completely hands-free.
        </p>
      </div>
    </section>
  );
}
