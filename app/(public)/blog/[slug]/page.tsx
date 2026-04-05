import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const isHtml = (text: string) => /<[a-z][\s\S]*>/i.test(text);
  const youtubeMatch = post.youtubeUrl?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/
  );
  const youtubeId = youtubeMatch ? youtubeMatch[1] : null;

  return (
    <div>
      {/* Hero */}
      <section className="bg-secondary py-16 flex flex-col items-center justify-center text-center px-4">
        <p className="text-white/60 text-sm mb-3">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {post.countryName && (
            <span className="mx-2">·</span>
          )}
          {post.countryName && (
            <Link
              href={`/our-work/${post.countrySlug}`}
              className="text-white/80 hover:text-white underline"
            >
              {post.countryName}
            </Link>
          )}
        </p>
        <h1 className="font-serif text-3xl md:text-5xl text-white max-w-3xl">
          {post.title}
        </h1>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className={`grid ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-2 mb-10 rounded-2xl overflow-hidden`}>
              {post.images.map((img, i) => (
                <div
                  key={i}
                  className={`relative ${post.images.length === 1 ? "h-72 md:h-[28rem]" : "h-56 md:h-72"} ${i === 0 && post.images.length === 3 ? "col-span-2" : ""}`}
                >
                  <Image
                    src={img}
                    alt={`${post.title} - Photo ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          )}

          {/* YouTube embed */}
          {youtubeId && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-10">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="w-full h-full"
                allowFullScreen
                title={post.title}
              />
            </div>
          )}

          {/* Body */}
          {isHtml(post.body) ? (
            <div
              className="rich-content text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <p className="text-lg text-text leading-relaxed whitespace-pre-line">
              {post.body}
            </p>
          )}

          {/* Country CTA */}
          {post.countrySlug && (
            <div className="mt-12 bg-secondary rounded-2xl p-8 md:p-12 text-center">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                Support {post.countryName || "This Project"}
              </h3>
              <p className="text-white/80 mb-6">
                Your donation directly feeds children and families in{" "}
                {post.countryName || "this region"}.
              </p>
              <Link
                href="/donate"
                className="inline-block bg-coral text-white font-semibold py-3 px-10 rounded-full text-lg hover:bg-coral/90 transition-colors duration-200"
              >
                Donate Now
              </Link>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-10">
            <Link
              href="/blog"
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
              Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
