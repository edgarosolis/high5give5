import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our Work" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Column 1: Logo & tagline */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-wide">
                HIGH<span className="text-accent">5</span>GIVE
                <span className="text-accent">5</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Empowering communities around the world through education,
              mentorship, and sustainable development.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@high5give5.org"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  info@high5give5.org
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs leading-relaxed text-white/50">
            High5Give5 is a registered 501(c)3 nonprofit organization. All
            donations are tax deductible.
          </p>
          <p className="mt-2 text-center text-xs text-white/40">
            &copy; 2024 High5Give5. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
