"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Button
      onClick={toggleDarkMode}
      variant="outline"
      size="icon"
      className="fixed top-4 right-4 z-50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-background/90 border-border"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-all rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 transition-all rotate-0 scale-100" />
      )}
    </Button>
  );
}
