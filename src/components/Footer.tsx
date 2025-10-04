import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 mt-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        {/* Left: Site Info */}
        <p className="text-sm text-center sm:text-left">
          © Podcast Hub {new Date().getFullYear()}
        </p>

        {/* Middle: Quick Links */}
        <nav className="flex flex-wrap justify-center sm:justify-start gap-4">
          <a href="/about" className="text-blue-500 hover:underline text-sm">
            About
          </a>
          <a href="/contact" className="text-blue-500 hover:underline text-sm">
            Contact
          </a>
          <a href="/terms" className="text-blue-500 hover:underline text-sm">
            Terms
          </a>
          <a href="/privacy" className="text-blue-500 hover:underline text-sm">
            Privacy
          </a>
        </nav>

        {/* Right: Social Icons */}
        <div className="flex justify-center sm:justify-end gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
            aria-label="Twitter"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900"
            aria-label="Facebook"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 12a10 10 0 10-11.5 9.95v-7.05h-2.25v-2.9h2.25v-2.2c0-2.2 1.32-3.42 3.34-3.42.97 0 1.98.17 1.98.17v2.18h-1.12c-1.1 0-1.44.68-1.44 1.37v1.6h2.44l-.39 2.9h-2.05v7.05A10 10 0 0022 12z"></path>
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
            aria-label="LinkedIn"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.98 3.5a2.5 2.5 0 11.02 0zm.02 4.5H2V21h3V8zM8 8h2.8v1.6h.04c.39-.73 1.34-1.5 2.76-1.5 2.95 0 3.5 1.94 3.5 4.46V21h-3v-6.56c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.48V21H8V8z"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
