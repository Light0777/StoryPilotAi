import Link from "next/link";
import { Sparkles, Target, Users, Eye, Rocket } from "lucide-react";

export default function AboutPage() {
  const problems = [
    "Content creation is exhausting and time-consuming",
    "Maintaining consistency across multiple accounts is difficult",
    "Stories disappear after 24 hours, requiring constant output",
    "Scaling virtual influencers requires massive manual effort",
  ];

  const audiences = [
    { icon: Users, title: "Creators", desc: "Individual content creators who want to automate their Instagram presence." },
    { icon: Target, title: "Agencies", desc: "Social media agencies managing multiple client accounts at scale." },
    { icon: Eye, title: "Brands", desc: "Companies building virtual brand ambassadors and promotional campaigns." },
    { icon: Rocket, title: "Virtual Influencer Operators", desc: "Teams running AI influencer accounts that need 24/7 content." },
  ];

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Building The Future Of
            <br />
            <span className="text-primary">AI Storytelling</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            StoryPilot AI is an AI-powered platform that helps creators, brands, agencies, and virtual influencers
            automatically generate and publish Instagram Stories. We believe the future of social media is autonomous,
            creative, and infinitely scalable.
          </p>
        </div>
      </div>

      <section className="border-t border-border px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Our Mission</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            StoryPilot AI exists to eliminate the manual burden of social media content creation. We empower anyone
            to launch and maintain AI-powered Instagram influencers that produce consistent, engaging, and
            believable story content without daily human intervention.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            By combining advanced AI character engines, narrative memory systems, and automated publishing
            workflows, we make it possible to run an entire Instagram presence on autopilot while maintaining
            the authenticity and consistency audiences expect.
          </p>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Problems We Solve</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {problems.map((p) => (
              <div key={p} className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <p className="text-foreground">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Who Uses StoryPilot AI</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Vision For The Future</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            We envision a world where anyone can create and manage a roster of AI-powered digital personalities
            that engage audiences, build communities, and generate value around the clock. StoryPilot AI is
            building the infrastructure for the next generation of autonomous digital creators.
          </p>
          <div className="mt-8">
            <Link
              href="/sign-up"
              className="inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start Building
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
