"use client";

import Link from "next/link";
import { Sparkles, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="relative mb-8">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-card">
          <Sparkles className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 text-2xl">🤖</div>
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
        Our AI Took A Wrong Turn.
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        We&apos;re already working on getting things back on track.
      </p>

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="mr-2 inline h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-accent/10"
        >
          <Home className="mr-2 inline h-4 w-4" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
