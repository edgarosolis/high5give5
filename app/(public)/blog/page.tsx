import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/content";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-secondary h-48 flex items-center justify-center">
        <h1 className="font-serif text-5xl text-white">Blog</h1>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-muted text-lg py-12">
              No blog posts yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const thumbnail = post.images?.[0];

                return (
                  <Link
                    key={post.slug}
                    href={`/our-work/${post.countrySlug}`}
                    className="bg-light rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-muted/10">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-muted/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <p className="text-xs text-muted mb-1">
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                        {post.countryName && (
                          <span className="ml-2 text-primary font-medium">
                            {post.countryName}
                          </span>
                        )}
                      </p>
                      <h3 className="font-serif text-lg font-bold text-secondary mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-text text-sm leading-relaxed line-clamp-3">
                        {post.body}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
