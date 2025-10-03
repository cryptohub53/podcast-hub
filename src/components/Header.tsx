"use client";

import { Mic, Waves } from "lucide-react";

export default function Header() {
  return (
    <header className="text-center mb-12 animate-fade-in">
      <div className="flex justify-center items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
          <div className="relative bg-primary/10 p-4 rounded-full">
            <Mic className="h-8 w-8 text-primary" />
          </div>
        </div>
        <Waves className="h-6 w-6 text-primary animate-bounce-gentle" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-slide-up">
        Podcast Hub
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up">
        Discover, explore, and enjoy your favorite podcasts in a modern, beautiful interface
      </p>
      
      <div className="mt-6 flex justify-center">
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
      </div>
    </header>
  );
}