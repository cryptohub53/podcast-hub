"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface DiscordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscordModal({ isOpen, onClose }: DiscordModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80" />

      <div
        className="relative bg-white dark:bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-muted transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-muted-foreground" />
        </button>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#5865F2] rounded-full blur-xl opacity-30"></div>
              <div className="relative bg-[#5865F2] rounded-full p-4">
                <img
                  src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66e3d7f4ef6498ac018f2c55_Symbol.svg"
                  alt="Discord"
                  className="h-12 w-12"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">
              Join Our Discord Community!
            </h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed">
              Connect with fellow podcast enthusiasts in{" "}
              <span className="font-semibold text-gray-900 dark:text-foreground">Podcast Hub</span>! Share
              your favorite shows, discover new content, and be part of our growing community.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <a
                href="https://discord.gg/sWMYzxsE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3"
              >
                <img
                  src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66e3d7f4ef6498ac018f2c55_Symbol.svg"
                  alt="Discord"
                  className="h-5 w-5"
                />
                Join Discord Server
              </a>
            </Button>

            <button
              onClick={onClose}
              className="w-full text-sm text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground transition-colors py-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
