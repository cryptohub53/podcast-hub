"use client";

import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl supports-backdrop-blur:bg-white/60">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo with gradient and animation */}
        <Link 
          href="/" 
          className="group flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white text-lg">🎙️</span>
            </div>
          </div>
          <span>PodcastHub</span>
        </Link>

        {/* Navigation Links with subtle indicators */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
          <Link 
            href="/" 
            className="relative text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/about" 
            className="relative text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/contact" 
            className="relative text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 group"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* Actions Container */}
        <div className="flex items-center space-x-4">
          {/* Optional: Add a CTA button */}
          <button className="hidden sm:block px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
            Listen Now
          </button>
          
          {/* Dark Mode Toggle */}
          <div className="border-l border-gray-200 dark:border-gray-700 pl-4">
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}