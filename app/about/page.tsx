import Link from "next/link";

const timeline = [
  {
    year: "2019",
    title: "Founded with $5",
    description:
      "Sam sold his toys and Genevieve sent a card with $5. A prayer, a chance, and a mission was born.",
  },
  {
    year: "2020",
    title: "Expanded to 5 Countries",
    description:
      "From a single act of generosity, High 5 Give 5 grew to serve children in five countries across multiple continents.",
  },
  {
    year: "2022",
    title: "Reached 15 Countries",
    description:
      "Our network of partners expanded rapidly, bringing meals and hope to children in 15 nations.",
  },
  {
    year: "2024",
    title: "Serving 22+ Countries",
    description:
      "Now feeding over 6,000 children daily across more than 22 countries, with no signs of slowing down.",
  },
];

export default function AboutPage() {
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
            How It Began
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-text">
                It started with a seven-year-old boy named Sam who had a heart
                bigger than his toy collection. One day, Sam decided to sell his
                toys -- not for a new video game or a bigger bike, but to feed
                children who were going hungry. Every dollar he raised went
                straight to feeding kids in need.
              </p>
              <p className="text-lg leading-relaxed text-text">
                A week later, a girl named Genevieve, also seven years old, sent
                a card with $5 tucked inside. Her message was simple but
                powerful: &quot;Take a chance with 5 and see how much more
                arrives.&quot;
              </p>
              <p className="text-lg leading-relaxed text-text">
                That $5 became a prayer and a promise. They took a chance, and
                what arrived was nothing short of a miracle -- a movement that
                would grow to feed thousands of children across the globe.
              </p>
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
            Ministry Overview
          </h2>
          <p className="text-lg text-muted leading-relaxed max-w-3xl mx-auto">
            High 5 Give 5 operates in over 22 countries around the world,
            partnering with local organizations to feed children, support the
            elderly, and bring hope to communities in need. From Europe to Asia,
            Africa to the Americas, and across the Middle East, our mission
            remains the same: take a chance with $5 and watch lives transform.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-secondary mb-8 text-center">
            See Our Impact
          </h2>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-secondary/5">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="High 5 Give 5 - Our Story"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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
