import { Sparkles } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">StoryPilot AI</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Terms &amp; Conditions</h1>
          <p className="mt-3 text-muted-foreground">Last updated: May 31, 2026</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_li]:mb-2">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using StoryPilot AI (&quot;the Platform&quot;), you agree to be bound by these Terms &amp; Conditions.
              If you do not agree, do not use the Platform.
            </p>
          </section>

          <section>
            <h2>2. Account Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring the accuracy of information you provide</li>
              <li>Complying with all applicable laws and regulations</li>
            </ul>
            <p>You must be at least 18 years old to use the Platform.</p>
          </section>

          <section>
            <h2>3. Subscription Terms</h2>
            <p>StoryPilot AI offers subscription plans with varying feature levels. Subscription fees are billed in advance on a monthly or annual basis. Features and pricing are subject to change with notice.</p>
          </section>

          <section>
            <h2>4. Payments</h2>
            <p>All payments are processed securely through our payment partners. Prices are listed in USD and do not include applicable taxes. Failed payments may result in service suspension.</p>
          </section>

          <section>
            <h2>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Platform for illegal, harmful, or deceptive purposes</li>
              <li>Generate content that violates Instagram&apos;s terms of service</li>
              <li>Create characters that impersonate real people without authorization</li>
              <li>Generate hateful, violent, or explicit content</li>
              <li>Attempt to bypass platform restrictions or access controls</li>
              <li>Use automated methods to scrape or abuse the Platform</li>
            </ul>
          </section>

          <section>
            <h2>6. Content Ownership</h2>
            <p>You retain ownership of all content you create using StoryPilot AI, including character designs, story narratives, and generated media. By using the Platform, you grant StoryPilot AI a license to process and store your content solely for the purpose of providing our service.</p>
          </section>

          <section>
            <h2>7. AI-Generated Content</h2>
            <p>StoryPilot AI uses artificial intelligence to generate content. We make no guarantees about:</p>
            <ul>
              <li>The accuracy or appropriateness of AI-generated content</li>
              <li>Compliance with Instagram&apos;s content policies</li>
              <li>Originality or copyright status of generated media</li>
            </ul>
            <p>You are solely responsible for reviewing and approving all content before publishing. Platform availability and content quality depend on third-party AI providers.</p>
          </section>

          <section>
            <h2>8. Refund Policy</h2>
            <p>We offer a 14-day money-back guarantee on annual subscriptions. Monthly subscriptions are non-refundable but can be canceled at any time. Refund requests are handled on a case-by-case basis for exceptional circumstances.</p>
          </section>

          <section>
            <h2>9. Service Availability</h2>
            <p>We strive for 99.9% platform uptime but do not guarantee uninterrupted service. The Platform may be temporarily unavailable for maintenance, updates, or due to factors beyond our control. We are not liable for losses resulting from service interruptions, including missed content publishing schedules.</p>
          </section>

          <section>
            <h2>10. Intellectual Property</h2>
            <p>The StoryPilot AI brand, logo, platform design, and underlying technology are our intellectual property. You may not copy, modify, distribute, or reverse-engineer any part of the Platform without our written consent.</p>
          </section>

          <section>
            <h2>11. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, StoryPilot AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including lost profits, data loss, or business interruption.</p>
          </section>

          <section>
            <h2>12. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. You may cancel your account at any time. Upon termination, your data will be deleted within 30 days.</p>
          </section>

          <section>
            <h2>13. Governing Law</h2>
            <p>These terms are governed by the laws of the State of Delaware, United States. Any disputes shall be resolved in the courts of Delaware.</p>
          </section>

          <section>
            <h2>14. Contact</h2>
            <p>For questions about these terms, contact us at hello@storypilot.ai.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
