"use client";

import Image from "next/image";
import Link from "next/image"; // Wait, app/page.tsx used Image for logo in footer, but Link for navigation.
// Let's re-verify imports.
import NextLink from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <NextLink href="/" className="hover:text-white">
                  Home
                </NextLink>
              </li>
              <li>
                <NextLink href="/about" className="hover:text-white">
                  About
                </NextLink>
              </li>
              <li>
                <NextLink href="/service" className="hover:text-white">
                  Services
                </NextLink>
              </li>
              <li>
                <NextLink href="/contact" className="hover:text-white">
                  Contact
                </NextLink>
              </li>
              <li>
                <NextLink href="/faq" className="hover:text-white">
                  Education &amp; Training
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-400">
              <p className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:support@inspire.com"
                  className="hover:text-white"
                >
                  support@inspire.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href="tel:9202202220" className="hover:text-white">
                  9202202220
                </a>
              </p>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="font-bold mb-4">Subscribe</h3>
            <div className="flex mb-4">
              <div className="relative flex-1">
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10 pr-4 py-3 rounded-l bg-white text-gray-900 placeholder-gray-500 w-full border-0 outline-none"
                />
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-r flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              Hello we are UI Monks. Our goal is to translate the positive
              effects from revolutionizing how companies engage with their
              clients & their team.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <NextLink href="/">
            <Image
              src="/logo.png"
              alt="NSPIRE"
              width={200}
              height={100}
              className="object-contain h-16 md:h-20 w-auto"
            />
          </NextLink>

          <div className="flex gap-6 text-gray-400">
            <NextLink href="/terms" className="hover:text-white">
              Terms
            </NextLink>
            <NextLink href="/privacy" className="hover:text-white">
              Privacy
            </NextLink>
            <NextLink href="/cookies" className="hover:text-white">
              Cookies
            </NextLink>
          </div>

          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white"
              aria-label="LinkedIn"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white"
              aria-label="Facebook"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white"
              aria-label="X (Twitter)"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
