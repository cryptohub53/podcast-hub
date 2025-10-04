"use client";

import { Github, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface FooterProps {
  onDiscordClick?: () => void;
}

export default function Footer({ onDiscordClick }: FooterProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side - Hacktoberfest participation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>
                <span className="font-medium text-foreground">Podcast Hub</span> is participating in{" "}
                <span className="font-medium text-orange-500">Hacktoberfest 2025</span>
              </span>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onDiscordClick}
              variant="outline"
              size="icon"
              className="group bg-background/50 border-[#5865F2]/30 hover:bg-[#5865F2]/10 hover:border-[#5865F2]/50 transition-all duration-200"
              aria-label="Join Discord"
            >
              <img
                src={
                  isDark
                    ? "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66e3d7f4ef6498ac018f2c55_Symbol.svg"
                    : "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66e3d80db9971f10a9757c99_Symbol.svg"
                }
                alt="Discord"
                className="h-4 w-4 transition-transform group-hover:scale-110"
              />
            </Button>

            <Button
              asChild
              variant="outline"
              className="group bg-background/50 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-200"
            >
              <a
                href="https://github.com/cryptohub53/podcast-hub/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                Contribute
                <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}