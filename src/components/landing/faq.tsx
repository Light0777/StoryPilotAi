"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is StoryPilot AI?",
    a: "StoryPilot AI is an AI-powered platform that automatically creates and publishes Instagram Stories. Create a character, define a narrative, and let StoryPilot generate story content on autopilot.",
  },
  {
    q: "How does StoryPilot AI work?",
    a: "StoryPilot AI creates a digital character, plans story content, generates visuals and captions, and publishes Instagram Stories automatically through connected publishing tools.",
  },
  {
    q: "Can StoryPilot AI create AI influencers?",
    a: "Yes. StoryPilot AI can generate ongoing content for virtual influencers, AI models, digital creators, brand ambassadors, and fictional characters while maintaining a consistent identity and narrative.",
  },
  {
    q: "Does StoryPilot AI post directly to Instagram?",
    a: "StoryPilot AI works with approved publishing tools and integrations to schedule and publish Instagram Stories automatically.",
  },
  {
    q: "Can I create multiple AI characters?",
    a: "Yes. You can manage multiple characters, narratives, and content schedules from a single dashboard.",
  },
  {
    q: "How many stories can StoryPilot AI generate?",
    a: "StoryPilot AI can generate daily story content based on your chosen posting frequency, narrative, and content strategy.",
  },
  {
    q: "Can StoryPilot AI maintain character consistency?",
    a: "Yes. StoryPilot AI is designed to maintain a consistent character identity, personality, visual style, and ongoing narrative across generated stories.",
  },
  {
    q: "Is StoryPilot AI useful for businesses?",
    a: "Yes. Businesses can use StoryPilot AI to create product stories, brand ambassadors, virtual creators, promotional campaigns, and always-on social media content.",
  },
  {
    q: "What makes StoryPilot AI different from social media schedulers?",
    a: "Traditional schedulers help publish content. StoryPilot AI creates the content itself, plans future stories, maintains a narrative, and automates the publishing workflow.",
  },
  {
    q: "Can StoryPilot AI help grow an Instagram account?",
    a: "StoryPilot AI helps maintain consistent posting and storytelling. Account growth depends on content quality, audience interest, and overall marketing strategy.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="px-6 py-16 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:mb-16 sm:text-5xl">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card transition-colors hover:border-[#333]"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-medium text-foreground"
              >
                {faq.q}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === i ? "max-h-80" : "max-h-0"
                }`}
              >
                <p className="border-t border-border px-6 py-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
