import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Image, BarChart3, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StoryPilot AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            AI-Powered Instagram Stories
            <br />
            <span className="text-primary">on Autopilot</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            StoryPilot AI automatically generates and publishes Instagram Stories
            for your AI influencers, virtual models, and brands. Set the mission
            and let AI handle the content.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">AI Story Planning</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Intelligent narrative continuity. The AI remembers past locations
                and themes to create coherent storylines.
              </p>
            </div>
            <div className="rounded-xl border p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Image Generation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                High-quality, portrait-oriented Instagram story images generated
                from detailed AI prompts with face consistency.
              </p>
            </div>
            <div className="rounded-xl border p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Auto Publishing</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Seamless Buffer integration. Schedule and publish stories
                automatically without manual intervention.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} StoryPilot AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
