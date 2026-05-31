"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Brain, UserCheck, Layout, Clock, Globe, Calendar, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Sparkles, title: "AI Character Engine", desc: "Create rich digital personalities with backstories, traits, and visual identity." },
  { icon: Brain, title: "Narrative Memory", desc: "Characters remember past stories, locations, and relationships for continuity." },
  { icon: UserCheck, title: "Face Consistency", desc: "Maintain a coherent look across every generated image and story." },
  { icon: Layout, title: "Story Planning", desc: "AI plans daily content that fits your character narrative arc." },
  { icon: Clock, title: "Auto Publishing", desc: "Schedule and publish stories 24/7 without lifting a finger." },
  { icon: Globe, title: "Buffer Integration", desc: "Seamlessly connects to Buffer for direct Instagram publishing." },
  { icon: Calendar, title: "Story Scheduling", desc: "Set publishing times that align with your audience engagement." },
  { icon: Users, title: "Multi-Character", desc: "Manage an entire roster of AI influencers from one dashboard." },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".feature-card", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "bottom 20%", scrub: 1 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative px-6 py-16 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Everything You Need
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-lg text-muted-foreground">
          A complete platform for running AI-powered Instagram influencers.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="feature-card group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{feat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
