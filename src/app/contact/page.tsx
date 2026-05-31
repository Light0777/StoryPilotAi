"use client";

import { useState } from "react";
import { Mail, MessageSquare, Bug, Lightbulb, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // In production, send to an API route
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    form.reset();
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Have a question, feature request, or need support? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <section className="border-t border-border px-6 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Send Us A Message</h2>
            {submitted ? (
              <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">Message Sent!</h3>
                <p className="mt-2 text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                  <input id="name" name="name" type="text" required
                    className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                  <input id="email" name="email" type="email" required
                    className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                  <select id="subject" name="subject" required
                    className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select a subject</option>
                    <option value="support">Support</option>
                    <option value="business">Business Inquiry</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                  <textarea id="message" name="message" rows={5} required
                    className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <button type="submit"
                  className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Contact Information</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">hello@storypilot.ai</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Response Time</p>
                    <p className="text-sm text-muted-foreground">We typically respond within 24 hours on business days.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Feature Requests</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Have an idea to improve StoryPilot? We review every feature request and prioritize based on community impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                  <Bug className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Bug Reports</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Found something broken? Include steps to reproduce and we&apos;ll get it fixed as quickly as possible.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Business Inquiries</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Interested in enterprise partnerships, API access, or white-label solutions? Contact our partnerships team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
