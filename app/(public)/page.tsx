import Hero from "@/components/Hero";
import ImpactCounter from "@/components/ImpactCounter";
import StorySection from "@/components/StorySection";
import CountryCard from "@/components/CountryCard";
import InteractiveMap from "@/components/InteractiveMap";
import DonateSection from "@/components/DonateSection";
import Link from "next/link";
import {
  getHomepageHero,
  getGlobalStats,
  getHomepageStory,
  getHomepageVideo,
  getDonateCTA,
  getAllCountries,
} from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const [hero, stats, story, video, donateCta, countries] = await Promise.all([
    getHomepageHero(),
    getGlobalStats(),
    getHomepageStory(),
    getHomepageVideo(),
    getDonateCTA(),
    getAllCountries(),
  ]);

  const featuredCountries = countries.slice(0, 4);

  return (
    <>
      <Hero content={hero} />

      <ImpactCounter stats={stats} />

      <StorySection content={story} />

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-wider text-sm font-semibold mb-4">
              How It Works
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary">
              Three Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">
                Give $5
              </h3>
              <p className="text-muted leading-relaxed">
                Make a simple $5 donation. That&apos;s all it takes to start
                changing lives around the world.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">
                We Distribute Locally
              </h3>
              <p className="text-muted leading-relaxed">
                Our partners on the ground deliver food directly to communities
                in {stats.countriesServed}+ countries.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">
                Lives Are Changed
              </h3>
              <p className="text-muted leading-relaxed">
                Children are fed, families gain hope, and communities grow
                stronger — one meal at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where We Serve — Interactive Map */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary uppercase tracking-wider text-sm font-semibold mb-4">
              Where We Serve
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary mb-4">
              Making an Impact Around the World
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Click on any pin to explore our work in that country. Every $5 donated provides {stats.mealsPerFive} meals.
            </p>
          </div>

          <InteractiveMap />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {featuredCountries.map((country) => (
              <CountryCard key={country.slug} country={country} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/our-work"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors"
            >
              See All Countries
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
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary uppercase tracking-wider text-sm font-semibold mb-4">
              {video.sectionLabel}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary">
              {video.heading}
            </h2>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <video
              controls
              preload="metadata"
              poster={video.posterImage}
              className="w-full h-auto"
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <DonateSection content={donateCta} />
    </>
  );
}
