import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="relative mb-8">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-card">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-muted-foreground">
          24h
        </div>
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
        This Story Has Expired.
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        The page you&apos;re looking for may have disappeared after 24 hours.
      </p>

      <div className="mt-10 flex items-center gap-4">
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="mr-2 inline h-4 w-4" />
          Return Home
        </Link>
        <Link
          href="/sign-up"
          className="rounded-xl border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-accent/10"
        >
          Generate New Story
        </Link>
      </div>
    </div>
  );
}
