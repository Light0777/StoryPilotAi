import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "StoryPilot AI - AI-Powered Instagram Story Generation",
  description:
    "Automatically generate and publish Instagram Stories for AI influencers, virtual models, creators, and brands.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem("theme");
                if (!t) t = matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
                document.documentElement.classList.toggle("dark", t === "dark");
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className={dmSans.className}>
        <ClerkProvider>
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}