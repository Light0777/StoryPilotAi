"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: "01", title: "Create Character", desc: "Design their personality, look, and story arc." },
  { num: "02", title: "Generate Stories", desc: "AI plans and creates engaging story content daily." },
  { num: "03", title: "Auto Publish", desc: "Stories go live on Instagram automatically." },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".step-card", { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.25, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", end: "bottom 30%", scrub: 1 },
      });

      if (lineRef.current) {
        gsap.fromTo(lineRef.current, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: "left center", duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", end: "center center", scrub: 1 },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative px-6 py-16 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:mb-20 sm:text-5xl lg:text-6xl">
          How It Works
        </h2>

        <div className="relative">
          <div ref={lineRef} className="absolute top-12 left-0 right-0 h-px origin-left border-border" />
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="step-card relative">
                <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-sm font-bold text-primary">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
