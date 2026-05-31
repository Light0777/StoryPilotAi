"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Play } from "lucide-react";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-line", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.15 })
        .fromTo(".hero-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
        .fromTo(ctaRef.current?.children ?? [], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, clearProps: "opacity,transform" }, "-=0.2")
        .fromTo(cardRef.current, { y: 80, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, clearProps: "opacity,transform,scale" }, "-=0.6");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const card = cardInnerRef.current;
    if (!card) return;

    const handleMouse = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, { rotateX: y * -6, rotateY: x * 6, transformPerspective: 1200, duration: 0.6, ease: "power2.out" });
      if (glowRef.current) {
        gsap.to(glowRef.current, { x: (e.clientX - rect.left) * 0.1, y: (e.clientY - rect.top) * 0.1, duration: 0.8, ease: "power2.out" });
      }
    };

    const handleLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power2.out" });
      if (glowRef.current) {
        gsap.to(glowRef.current, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
      }
    };

    card.addEventListener("mousemove", handleMouse);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouse);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative flex min-h-screen flex-col overflow-hidden px-6 pt-20 sm:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center">
        <h1 className="hero-line text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-6xl lg:text-7xl">
          Run An Instagram Influencer
          <br />
          <span className="text-primary">That Never Sleeps.</span>
        </h1>

          <p className="hero-sub mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base md:text-lg">
          Create AI characters, generate stories, and publish automatically while maintaining a believable ongoing narrative.
        </p>

        <div ref={ctaRef} className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <a
            href="/sign-up"
            className="w-full rounded-2xl bg-primary px-7 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto sm:py-4"
          >
            Start Creating
          </a>
          <button
            type="button"
            className="w-full cursor-pointer rounded-2xl border border-border px-7 py-3 text-base text-foreground transition-colors hover:bg-accent/10 sm:w-auto sm:py-4"
          >
            <Play className="mr-2 inline h-4 w-4" />
            Watch Demo
          </button>
        </div>
      </div>

          <div ref={cardRef} className="relative z-10 mx-auto w-full max-w-md pt-10 pb-8 sm:pt-16 sm:pb-12">
        <div ref={cardInnerRef} className="relative" style={{ transformStyle: "preserve-3d" }}>
          <div ref={glowRef} className="pointer-events-none absolute -inset-4 rounded-2xl bg-primary/10 blur-2xl opacity-70" />
          <img
            src="/assets/Group 1.png"
            alt="Instagram Story Showcase"
            className="h-auto w-full rounded-2xl"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
