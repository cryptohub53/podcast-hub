import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer"; // <-- import your Footer component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Podcast Hub - Discover Amazing Podcasts",
  description:
    "Discover, explore, and enjoy your favorite podcasts in a modern, beautiful interface. Find the best podcasts across technology, cybersecurity, and more.",
  keywords: [
    "podcasts",
    "technology",
    "cybersecurity",
    "web development",
    "software engineering",
  ],
  authors: [{ name: "Podcast Hub Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#a855f7" },
    { media: "(prefers-color-scheme: dark)", color: "#a855f7" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <main className="flex-grow">{children}</main> {/* ensures footer stays at bottom */}
        <Footer />
      </body>
    </html>
  );
}
