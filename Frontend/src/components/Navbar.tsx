"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Home, Headphones, Mail, Menu, X } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('header')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Podcasts', href: '/#podcasts', icon: Headphones },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const scrollToTop = (e: React.MouseEvent, href: string) => {
    if (href === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/90 backdrop-blur-md border-b border-border/50 shadow-lg' 
            : 'bg-background/50 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 sm:gap-3 group relative z-10"
              onClick={(e) => scrollToTop(e, '/')}
            >
              <Image 
                src="/podcast-hub-logo.png" 
                alt="Podcast Hub Logo" 
                width={180}
                height={60}
                className="h-10 sm:h-12 w-auto transition-all duration-300 group-hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href.split('#')[0]));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToTop(e, item.href)}
                    className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/10 text-primary shadow-sm' 
                        : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Link>
                );
              })}
              <div className="ml-2 pl-2 border-l border-border/50">
                <DarkModeToggle />
              </div>
            </nav>

            {/* Mobile menu button and dark mode toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <DarkModeToggle />
              <button 
                className="p-2 rounded-lg hover:bg-accent transition-colors relative z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation with animation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-background/95 backdrop-blur-md border-t border-border/50 shadow-lg">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href.split('#')[0]));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToTop(e, item.href)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/10 text-primary shadow-sm' 
                        : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMenuOpen ? 'slideIn 0.3s ease-out forwards' : 'none'
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          style={{
            animation: 'fadeIn 0.2s ease-out'
          }}
        />
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
