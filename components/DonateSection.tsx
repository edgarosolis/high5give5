import Link from "next/link";

export default function DonateSection() {
  return (
    <section className="py-24 bg-coral">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
          Your $5 Can Change Everything
        </h2>
        <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Every $5 donated provides 50 meals to those in need. 100% of your
          donation goes directly to feeding programs.
        </p>
        <Link
          href="/donate"
          className="inline-block bg-white text-coral font-bold rounded-full px-10 py-4 text-lg hover:bg-white/90 transition-colors"
        >
          Donate Now
        </Link>
        <p className="text-white/70 text-sm mt-6">
          High 5 Give 5 is a 501(c)(3) nonprofit organization. All donations
          are tax deductible.
        </p>
      </div>
    </section>
  );
}
