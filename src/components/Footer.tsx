import React from "react";

type SocialLink = {
  name: "X" | "GitHub" | "LinkedIn" | "YouTube" | "Instagram";
  href: string;
  ariaLabel?: string;
};

type FooterProps = {
  siteName?: string;
  year?: number;
  quickLinks?: { label: string; href: string }[];
  social?: SocialLink[];
  className?: string;
};

const iconMap: Record<SocialLink["name"], JSX.Element> = {
  X: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M18.9 2H22l-8.6 9.8L22.7 22H16l-5-6.1L4.9 22H1.8l9.3-10.6L2.5 2H9l4.5 5.5L18.9 2z" />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.4.7-4.1-1.6-4.1-1.6-.5-1.3-1.2-1.6-1.2-1.6-1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 .1.7 2 .7 2 1.2 2 3.1 1.4 3.8 1.1.1-.9.5-1.5.9-1.9-2.7-.3-5.6-1.3-5.6-6 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0C18.3 5 19.3 5.3 19.3 5.3c.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.7-2.9 5.7-5.6 6 .5.4 1 1.3 1 2.6v3.8c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/>
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0zM9 8h4.7v2.2h.1c.6-1.1 2.1-2.2 4.2-2.2 4.5 0 5.3 3 5.3 6.8V24h-5v-7.1c0-1.7 0-3.9-2.4-3.9s-2.8 1.9-2.8 3.8V24H9z"/>
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.3.6 9.3.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1c.4-1.8.5-3.8.5-5.8s0-4-.5-5.8zM9.6 15.5V8.5l6.2 3.5-6.2 3.5z"/>
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .4 1.4.8.4.4.7.8.8 1.4.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.4 1-.8 1.4-.4.4-.8.7-1.4.8-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.4-1.4-.8-.4-.4-.7-.8-.8-1.4-.2-.5-.3-1.2-.4-2.4-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.4-1 .8-1.4.4-.4.8-.7 1.4-.8.5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-2 .3-.5.2-.8.3-1 .6-.3.3-.5.5-.6 1-.1.4-.2 1-.3 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.3 2 .2.5.3.8.6 1 .3.3.5.5 1 .6.4.1 1 .2 2 .3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 2-.3.5-.2.8-.3 1-.6.3-.3.5-.5.6-1 .1-.4.2-1 .3-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.3-2-.2-.5-.3-.8-.6-1-.3-.3-.5-.5-1-.6-.4-.1-1-.2-2-.3-1.2-.1-1.6-.1-4.7-.1zm0 3.3a5.7 5.7 0 1 1 0 11.4 5.7 5.7 0 0 1 0-11.4zm0 2a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4zM18 5.6a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z"/>
    </svg>
  ),
};

export function Footer({
  siteName = "podcast-hub",
  year = new Date().getFullYear(),
  quickLinks = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
  social,
  className,
}: FooterProps) {
  return (
    <footer
      aria-labelledby="footer-heading"
      className={
        [
          "w-full bg-neutral-900 text-neutral-200",
          "border-t border-neutral-800",
          "px-4 sm:px-6 lg:px-8 py-8",
          className,
        ].filter(Boolean).join(" ")
      }
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="text-lg font-semibold">{siteName}</p>
            <p className="mt-1 text-sm text-neutral-400">
              © {year} {siteName}. All rights reserved.
            </p>
          </div>

          <nav aria-label="Footer" className="w-full md:w-auto">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:auto-cols-max md:grid-flow-col">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-neutral-300 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {social && social.length > 0 && (
            <div className="flex items-center gap-4">
              {social.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.ariaLabel ?? s.name}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                >
                  {iconMap[s.name]}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}