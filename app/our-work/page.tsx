import Link from "next/link";
import { countries } from "@/lib/countries";
import CountryFilter from "@/components/CountryFilter";

export default function OurWorkPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-secondary h-64 flex items-center justify-center">
        <h1 className="font-serif text-5xl text-white">Where We Serve</h1>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-white">24+</p>
            <p className="text-white/80 text-lg mt-1">Countries</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">6,000+</p>
            <p className="text-white/80 text-lg mt-1">Children</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">2,000+</p>
            <p className="text-white/80 text-lg mt-1">Elderly</p>
          </div>
        </div>
      </section>

      {/* Country Grid with Filter */}
      <section className="py-16 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CountryFilter countries={countries} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-secondary text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Every Dollar Makes a Difference
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Your generosity feeds children, supports the elderly, and
            transforms communities around the world.
          </p>
          <Link
            href="/donate"
            className="inline-block bg-coral text-white font-semibold py-3 px-10 rounded-full text-lg hover:bg-coral/90 transition-colors duration-200"
          >
            Donate Now
          </Link>
        </div>
      </section>
    </div>
  );
}
