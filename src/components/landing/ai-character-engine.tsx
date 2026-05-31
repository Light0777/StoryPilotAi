"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const metaCards = [
  { label: "Personality", value: "Adventurous" },
  { label: "Current Arc", value: "European Tour" },
  { label: "Stories Today", value: "3" },
  { label: "Status", value: "Active" },
];

export function AICharacterEngine() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { scale: 0.9, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 30%", scrub: 1 },
      });

      gsap.to(cardRef.current, {
        scale: 1.04,
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "center center", scrub: 1.5 },
      });

      gsap.fromTo(".meta-card", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "center center", scrub: 1 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen px-6 py-16 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Build Living
            <br />
            <span className="text-primary">Digital Characters.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Create personalities, narratives, travel arcs and daily experiences that feel real and relatable.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div ref={cardRef}>
            <img
              src="/assets/AI Character Engine _ Halo Medallion Card.png"
              alt="AI Character Engine"
              className="h-auto w-full rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            {metaCards.map((card) => (
              <div
                key={card.label}
                className="meta-card flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4 opacity-0"
              >
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <span className="font-medium text-foreground">{card.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
