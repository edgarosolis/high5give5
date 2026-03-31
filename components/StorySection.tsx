import Link from "next/link";
import type { StoryContent } from "@/lib/types";

interface StorySectionProps {
  content?: StoryContent;
}

export default function StorySection({ content }: StorySectionProps) {
  const sectionLabel = content?.sectionLabel || "Our Story";
  const heading = content?.heading || "It Started With Two 7-Year-Olds and $5";
  const bodyText = content?.bodyText || 'It all began when Sam, just 7 years old, sold his toys to raise money to feed the poor. Around the same time, a little girl named Genevieve, also 7, sent a handwritten card along with $5, with a simple message: \u201cTake a chance with 5.\u201d Their compassion sparked a movement \u2014 proving that even the smallest gift can make the biggest difference. Today, High 5 Give 5 carries that spirit forward, turning every $5 into 50 meals for those in need around the world.';
  const linkText = content?.linkText || "Read Our Story";
  const linkUrl = content?.linkUrl || "/about";

  return (
    <section className="py-24 bg-accent/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <div>
            <p className="text-primary uppercase tracking-wider text-sm font-semibold mb-4">
              {sectionLabel}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary mb-6">
              {heading}
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              {bodyText}
            </p>
            <Link
              href={linkUrl}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              {linkText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          {/* Decorative side */}
          <div className="flex justify-center">
            <div className="relative w-72 h-80">
              {/* Background decorative shapes */}
              <div className="absolute top-4 right-4 w-full h-full rounded-2xl border-2 border-primary/20" />
              <div className="absolute inset-0 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl font-serif font-bold text-primary">
                    5
                  </div>
                  <div className="w-16 h-1 bg-accent mx-auto mt-2 mb-3 rounded-full" />
                  <p className="text-secondary font-semibold text-lg">
                    High 5 Give 5
                  </p>
                  <p className="text-muted text-sm mt-1">
                    Every dollar counts
                  </p>
                </div>
              </div>
              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-accent rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
