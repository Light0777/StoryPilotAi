import { Sparkles } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">StoryPilot AI</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-muted-foreground">Last updated: May 31, 2026</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_li]:mb-2">
          <section>
            <h2>1. Introduction</h2>
            <p>
              StoryPilot AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
              AI-powered Instagram Story generation platform.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>Account Information</h3>
            <p>When you create an account, we collect your name, email address, and authentication credentials. If you sign in using Google OAuth, we receive the profile information you authorize.</p>

            <h3>Usage Data</h3>
            <p>We collect information about how you interact with our platform, including characters created, stories generated, publishing activity, and feature usage patterns.</p>

            <h3>Analytics Data</h3>
            <p>We use analytics tools to understand platform performance, user behavior, and feature adoption. This includes page views, session duration, and interaction events.</p>

            <h3>Cookies</h3>
            <p>We use essential cookies for authentication and session management. Optional analytics cookies help us improve the platform. You can control cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2>3. Third-Party Services</h2>
            <p>StoryPilot AI integrates with the following third-party services:</p>
            <ul>
              <li><strong>Clerk</strong> — Authentication and user management</li>
              <li><strong>Supabase</strong> — Database hosting and storage</li>
              <li><strong>Buffer</strong> — Social media publishing integration</li>
              <li><strong>OpenAI / OpenRouter</strong> — AI content generation</li>
              <li><strong>Cloudflare R2</strong> — File and image storage</li>
            </ul>
            <p>Each service operates under its own privacy policy. We only share the minimum data necessary for platform functionality.</p>
          </section>

          <section>
            <h2>4. Data Storage &amp; Security</h2>
            <p>Your data is stored securely on Supabase PostgreSQL databases with encryption at rest and in transit. We implement industry-standard security measures including:</p>
            <ul>
              <li>Encrypted data transmission (TLS/SSL)</li>
              <li>Encrypted API key storage (AES-256-GCM)</li>
              <li>Secure authentication via Clerk</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2>5. User Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p>To exercise these rights, contact us at hello@storypilot.ai.</p>
          </section>

          <section>
            <h2>6. GDPR Compliance</h2>
            <p>If you are a resident of the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):</p>
            <ul>
              <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to restrict processing</li>
            </ul>
            <p>Our lawful basis for processing your data includes contract performance (providing our service), legitimate interests (improving our platform), and consent (where required).</p>
          </section>

          <section>
            <h2>7. CCPA Compliance</h2>
            <p>If you are a California resident, the California Consumer Privacy Act (CCPA) gives you the right to:</p>
            <ul>
              <li>Know what personal information we collect</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of the sale of personal information</li>
              <li>Non-discrimination for exercising your rights</li>
            </ul>
            <p>We do not sell your personal information. To make a CCPA request, contact hello@storypilot.ai.</p>
          </section>

          <section>
            <h2>8. Data Retention</h2>
            <p>We retain your data for as long as your account is active. Upon account deletion, we delete or anonymize your data within 30 days, except where legal obligations require longer retention.</p>
          </section>

          <section>
            <h2>9. Changes To This Policy</h2>
            <p>We may update this Privacy Policy periodically. Material changes will be notified via email or platform notice. Continued use after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>For privacy-related inquiries, contact us at hello@storypilot.ai.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
