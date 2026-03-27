"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/our-work", label: "Our Work" },
  { href: "/blog", label: "Blog" },
  { href: "/media", label: "Media" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <motion.nav
      initial={{ backgroundColor: "rgba(255,255,255,0)" }}
      animate={{
        backgroundColor: scrolled ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
        boxShadow: scrolled
          ? "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)"
          : "0 0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span
              className={`font-serif text-2xl font-bold tracking-wide transition-colors duration-300 ${
                scrolled ? "text-primary" : "text-white"
              }`}
            >
              HIGH<span className="text-accent">5</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${
                  scrolled ? "text-secondary" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              className="rounded-full bg-coral px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Donate
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-0.5 w-6 rounded transition-all duration-300 ${
                mobileOpen
                  ? "translate-y-2 rotate-45 bg-white"
                  : scrolled
                    ? "bg-secondary"
                    : "bg-white"
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded transition-all duration-300 ${
                mobileOpen
                  ? "opacity-0"
                  : scrolled
                    ? "bg-secondary"
                    : "bg-white"
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded transition-all duration-300 ${
                mobileOpen
                  ? "-translate-y-2 -rotate-45 bg-white"
                  : scrolled
                    ? "bg-secondary"
                    : "bg-white"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <motion.div
        initial={false}
        animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-secondary md:hidden"
        style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="font-serif text-2xl font-medium text-white transition-colors hover:text-accent"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/donate"
          onClick={() => setMobileOpen(false)}
          className="mt-4 rounded-full bg-coral px-8 py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90"
        >
          Donate
        </Link>
      </motion.div>
    </motion.nav>
  );
}
