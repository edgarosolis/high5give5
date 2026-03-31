import Link from "next/link";
import type { DonateCTAContent } from "@/lib/types";

interface DonateSectionProps {
  content?: DonateCTAContent;
}

export default function DonateSection({ content }: DonateSectionProps) {
  const heading = content?.heading || "Your $5 Can Change Everything";
  const bodyText = content?.bodyText || "Every $5 donated provides 50 meals to those in need. 100% of your donation goes directly to feeding programs.";
  const buttonText = content?.buttonText || "Donate Now";
  const buttonLink = content?.buttonLink || "/donate";
  const footnote = content?.footnote || "High 5 Give 5 is a 501(c)(3) nonprofit organization. All donations are tax deductible.";

  return (
    <section className="py-24 bg-coral">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
          {heading}
        </h2>
        <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          {bodyText}
        </p>
        <Link
          href={buttonLink}
          className="inline-block bg-white text-coral font-bold rounded-full px-10 py-4 text-lg hover:bg-white/90 transition-colors"
        >
          {buttonText}
        </Link>
        <p className="text-white/70 text-sm mt-6">
          {footnote}
        </p>
      </div>
    </section>
  );
}
