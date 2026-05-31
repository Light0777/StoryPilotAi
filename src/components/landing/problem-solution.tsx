"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  "Content creation is exhausting",
  "Stories disappear after 24 hours",
  "Consistency is hard to maintain",
  "Managing multiple accounts is painful",
];

const solutions = [
  "AI creates fresh content daily",
  "24/7 autonomous publishing",
  "Effortless brand consistency",
  "Scale to infinite characters",
];

export function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { scale: 0.95 }, {
        scale: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen px-6 py-16 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            From Struggle to <span className="text-primary">Autopilot</span>
          </h2>

          <div className="mt-12 space-y-4">
            {problems.map((p, i) => (
              <div key={`p-${i}`} className="flex items-center gap-3 text-base text-muted-foreground sm:text-lg">
                <div className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                {p}
              </div>
            ))}
          </div>

          <div className="mt-2 text-lg font-medium text-primary">— becomes —</div>

          <div className="space-y-4">
            {solutions.map((s, i) => (
              <div key={`s-${i}`} className="flex items-center gap-3 text-base text-foreground sm:text-lg">
                <div className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                {s}
              </div>
            ))}
          </div>
        </div>

        <div ref={cardRef} className="hidden justify-self-center lg:block">
          <img src="/assets/Group 1.png" alt="Instagram Story" className="h-auto w-72 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
