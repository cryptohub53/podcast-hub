"use client";

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a860b94 (Refactor the project structure and set-up mongo db in the backend)
=======
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 151b0b3 (Refactor the project structure and set-up mongo db in the backend)
>>>>>>> 1cb259e (Refactor the project structure and set-up mongo db in the backend)
import { useEffect, useState } from "react";

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="text-center mb-12 pt-8 relative overflow-hidden">
      {/* Animated Background SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3">
                <animate attributeName="stop-opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1">
                <animate attributeName="stop-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          
          {/* Animated Sound Waves */}
          <path d="M 0,200 Q 250,150 500,200 T 1000,200" fill="none" stroke="url(#gradient1)" strokeWidth="2">
            <animate attributeName="d" 
              values="M 0,200 Q 250,150 500,200 T 1000,200;M 0,200 Q 250,250 500,200 T 1000,200;M 0,200 Q 250,150 500,200 T 1000,200" 
              dur="4s" 
              repeatCount="indefinite" />
          </path>
          <path d="M 0,180 Q 250,130 500,180 T 1000,180" fill="none" stroke="url(#gradient1)" strokeWidth="1.5" opacity="0.7">
            <animate attributeName="d" 
              values="M 0,180 Q 250,130 500,180 T 1000,180;M 0,180 Q 250,230 500,180 T 1000,180;M 0,180 Q 250,130 500,180 T 1000,180" 
              dur="3.5s" 
              repeatCount="indefinite" />
          </path>
          <path d="M 0,220 Q 250,170 500,220 T 1000,220" fill="none" stroke="url(#gradient1)" strokeWidth="1.5" opacity="0.7">
            <animate attributeName="d" 
              values="M 0,220 Q 250,170 500,220 T 1000,220;M 0,220 Q 250,270 500,220 T 1000,220;M 0,220 Q 250,170 500,220 T 1000,220" 
              dur="4.5s" 
              repeatCount="indefinite" />
          </path>
        </svg>
      </div>

      <div className={`relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        {/* Animated Microphone Icon */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="relative group">
            {/* Pulsing Rings */}
            <div className="absolute inset-0 -m-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3">
                  <animate attributeName="r" values="35;48;35" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3">
                  <animate attributeName="r" values="30;43;30" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>

            {/* Main Icon Container */}
            <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 rounded-full backdrop-blur-sm border border-primary/20 transition-all duration-300 group-hover:rotate-3 group-hover:shadow-xl group-hover:shadow-primary/30">
              <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Microphone */}
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z">
                  <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
                </path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
                <line x1="8" x2="16" y1="22" y2="22" />
              </svg>
            </div>
          </div>

          {/* Animated Sound Bars */}
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-1.5" height="32" viewBox="0 0 4 32">
                <rect x="0" y="0" width="4" height="32" fill="hsl(var(--primary))" rx="2">
                  <animate 
                    attributeName="height" 
                    values="8;32;8" 
                    dur={`${0.8 + i * 0.2}s`}
                    repeatCount="indefinite" 
                  />
                  <animate 
                    attributeName="y" 
                    values="12;0;12" 
                    dur={`${0.8 + i * 0.2}s`}
                    repeatCount="indefinite" 
                  />
                </rect>
              </svg>
            ))}
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
          Podcast Hub
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8 px-4">
          Discover, explore, and enjoy your favorite podcasts in a modern, beautiful interface
        </p>
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
=======
=======
>>>>>>> 1cb259e (Refactor the project structure and set-up mongo db in the backend)
>>>>>>> dcfcaf7 (Refactor the project structure and set-up mongo db in the backend)
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
<<<<<<< HEAD
>>>>>>> dcfcaf7 (Refactor the project structure and set-up mongo db in the backend)
=======
>>>>>>> dcfcaf7 (Refactor the project structure and set-up mongo db in the backend)
<<<<<<< HEAD
=======
>>>>>>> a860b94 (Refactor the project structure and set-up mongo db in the backend)
=======
>>>>>>> 151b0b3 (Refactor the project structure and set-up mongo db in the backend)
>>>>>>> 1cb259e (Refactor the project structure and set-up mongo db in the backend)
      </div>
    </header>
  );
}