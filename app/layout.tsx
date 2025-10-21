import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

/**
 * Configure Geist Sans font for general text
 * Variable font enables custom font weights
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Configure Geist Mono font for code and monospace text
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Global metadata configuration for SEO
 */
export const metadata: Metadata = {
  title: "Signalist",
  description: "Track real-time stock prices, get personalized alerts and explore details company insights.",
};

/**
 * Root Layout Component
 * Wraps all pages with common configuration:
 * - Dark theme
 * - Custom fonts
 * - Toast notifications
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
