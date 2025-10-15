"use client";

import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <main className="relative container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Image 
              src="/icon.svg"
              alt="Podcast Hub Logo" 
              width={300}
              height={100}
              className="mx-auto"
              priority
            />

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Coming Soon
            </h1>

            <div className="flex items-center justify-center gap-2 text-xl text-muted-foreground">
              <Construction className="w-6 h-6 animate-bounce" />
              <p>Under Development</p>
            </div>

            <p className="max-w-md mx-auto text-muted-foreground">
              We're working hard to bring you an amazing podcast discovery experience. 
              Stay tuned for updates!
            </p>

            <div className="pt-8">
              <a
                href="/podcast"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-medium transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
              >
                Browse Podcasts
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}