import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryBySlug, getBlogPostsByCountry } from "@/lib/content";
import { getCountryMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: slug } = await params;
  const country = await getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const blogPosts = await getBlogPostsByCountry(slug);
  const media = getCountryMedia(slug);
  const isHtml = (text: string) => /<[a-z][\s\S]*>/i.test(text);

  return (
    <div>
      {/* Hero */}
      <section className="bg-secondary h-80 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">
          {country.name}
        </h1>
        {country.tagline ? (
          <p className="text-white/80 text-lg">{country.tagline}</p>
        ) : (
          <p className="text-white/80 text-lg">{country.projectType}</p>
        )}
        {country.partner && (
          <p className="text-white/60 text-sm mt-2">
            In partnership with {country.partner}
          </p>
        )}
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Country Image */}
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg mb-10">
            <Image
              src={country.imageUrl}
              alt={country.name}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>

          {/* Introduction */}
          {country.description && (
            isHtml(country.description) ? (
              <div
                className="rich-content text-lg leading-relaxed mb-10"
                dangerouslySetInnerHTML={{ __html: country.description }}
              />
            ) : (
              <p className="text-lg text-text leading-relaxed mb-10">
                {country.description}
              </p>
            )
          )}

          {/* Impact Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
              <p className="font-serif text-3xl font-bold text-primary">
                {country.mealsPerFive}
              </p>
              <p className="text-muted mt-1">meals provided per $5</p>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
              <p className="font-serif text-3xl font-bold text-secondary">
                {country.childrenFed}
              </p>
              <p className="text-muted mt-1">children currently being fed</p>
            </div>
          </div>

          {/* Project Description (rich text or legacy sections) */}
          {country.intro && (
            isHtml(country.intro) ? (
              <div
                className="rich-content mb-12"
                dangerouslySetInnerHTML={{ __html: country.intro }}
              />
            ) : (
              <p className="text-text leading-relaxed mb-12">
                {country.intro}
              </p>
            )
          )}

          {/* Legacy Rich Content Sections (for backward compat) */}
          {country.sections && country.sections.length > 0 && !country.intro && (
            <div className="space-y-12 mb-12">
              {country.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary mb-4">
                    {section.title}
                  </h2>
                  {section.content && (
                    <p className="text-text leading-relaxed mb-4">
                      {section.content}
                    </p>
                  )}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-3">
                      {section.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1.5 w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-text leading-relaxed">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Photos */}
          {media && media.photoCount > 0 && (
            <div className="mb-12">
              <div className="flex items-end justify-between mb-6">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary">
                  Photos
                </h2>
                <p className="text-muted text-sm">
                  {media.photoCount} from {country.name}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {media.photos.map((p) => (
                  <a
                    key={p.fileId}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square rounded-lg overflow-hidden bg-light shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Image
                      src={p.url}
                      alt={p.alt || `${country.name} photo`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                    {p.blogTitle && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-[10px] font-medium line-clamp-2">
                          {p.blogTitle}
                        </p>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Latest Updates */}
          {blogPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary mb-6">
                Latest Updates
              </h2>
              <div className="space-y-8">
                {blogPosts.map((post) => {
                  const youtubeMatch = post.youtubeUrl?.match(
                    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/
                  );
                  const youtubeId = youtubeMatch ? youtubeMatch[1] : null;

                  return (
                    <article
                      key={post.slug}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                    >
                      {post.images && post.images.length > 0 && (
                        <div className={`grid ${post.images.length === 1 ? "grid-cols-1" : post.images.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"} gap-0.5`}>
                          {post.images.map((img, i) => (
                            <div
                              key={i}
                              className={`relative ${post.images.length === 1 ? "h-64 md:h-80" : "h-48"} ${i === 0 && post.images.length === 3 ? "col-span-2 sm:col-span-1" : ""}`}
                            >
                              <Image
                                src={img}
                                alt={`${post.title} - Photo ${i + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 896px) 100vw, 448px"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {youtubeId && (
                        <div className="aspect-video">
                          <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            className="w-full h-full"
                            allowFullScreen
                            title={post.title}
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <p className="text-xs text-muted mb-2">
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <h3 className="font-serif text-xl font-bold text-secondary mb-2">
                          {post.title}
                        </h3>
                        <p className="text-text leading-relaxed whitespace-pre-line">
                          {post.body}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-secondary rounded-2xl p-8 md:p-12 text-center">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
              Support {country.name}
            </h3>
            <p className="text-white/80 mb-6">
              Your donation directly feeds children and families in{" "}
              {country.name}.
            </p>
            <Link
              href="/donate"
              className="inline-block bg-coral text-white font-semibold py-3 px-10 rounded-full text-lg hover:bg-coral/90 transition-colors duration-200"
            >
              Donate Now
            </Link>
          </div>

          {/* Back Link */}
          <div className="mt-10">
            <Link
              href="/our-work"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
