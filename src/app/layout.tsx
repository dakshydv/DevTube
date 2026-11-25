import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { CATEGORIES, primaryInCategory } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "DevTube: the best tech talks, organized", template: "%s · DevTube" },
  description:
    "The best AI, ML, software engineering and computer science videos that Hacker News loved, sorted by topic and difficulty, plus learning paths for beginners.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.slug, primaryInCategory(c.slug).length]));
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <AppShell counts={counts}>{children}</AppShell>
      </body>
    </html>
  );
}
