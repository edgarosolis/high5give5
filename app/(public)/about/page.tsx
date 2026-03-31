import Link from "next/link";
import {
  getFoundingStory,
  getTimelineEntries,
  getMinistryOverview,
  getHomepageVideo,
} from "@/lib/content";

export const revalidate = 60;

export default async function AboutPage() {
  const [story, timeline, ministry, video] = await Promise.all([
    getFoundingStory(),
    getTimelineEntries(),
    getMinistryOverview(),
    getHomepageVideo(),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-secondary h-64 flex items-center justify-center">
        <h1 className="font-serif text-5xl text-white">Our Story</h1>
      </section>

      {/* How It Began */}
      <section className="bg-accent/10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary mb-12 text-center">
            {story.heading}
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {story.paragraphs.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-text">
                  {p}
                </p>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[320px]">
              <div className="w-24 h-24 rounded-full bg-accent/30 flex items-center justify-center mb-6">
                <span className="font-serif text-4xl text-secondary">$5</span>
              </div>
              <p className="font-serif text-2xl text-secondary text-center font-bold">
                &quot;Take a chance with 5&quot;
              </p>
              <p className="text-muted mt-3 text-center">
                A card, a prayer, and a world changed forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary mb-16 text-center">
            Our Journey
          </h2>
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary" />

            <div className="space-y-12">
              {timeline.map((item) => (
                <div key={item.year} className="relative pl-14">
                  {/* Dot */}
                  <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-primary border-4 border-white shadow" />
                  <div>
                    <span className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-secondary">
                      {item.title}
                    </h3>
                    <p className="text-muted mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ministry Overview */}
      <section className="py-20 bg-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary mb-6">
            {ministry.heading}
          </h2>
          <p className="text-lg text-muted leading-relaxed max-w-3xl mx-auto">
            {ministry.bodyText}
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-secondary mb-8 text-center">
            See Our Impact
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-lg">
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

      {/* CTA */}
      <section className="py-20 bg-secondary text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Mission
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Every $5 has the power to change a life. Will you take the chance?
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
