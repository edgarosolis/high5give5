import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryMedia, getCountryMediaSlugs } from "@/lib/media";

export function generateStaticParams() {
  return getCountryMediaSlugs().map((country) => ({ country }));
}

export default async function CountryMediaPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: slug } = await params;
  const data = getCountryMedia(slug);
  if (!data || data.photoCount === 0) notFound();

  return (
    <div>
      <section className="bg-secondary h-56 flex flex-col items-center justify-center text-center px-4">
        <p className="text-white/60 text-sm mb-2">
          <Link href="/media" className="hover:text-white">
            ← All countries
          </Link>
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-white">{data.name}</h1>
        {data.subtitle && <p className="text-white/80 text-lg mt-2">{data.subtitle}</p>}
        <p className="text-white/60 text-sm mt-3">{data.photoCount} photos</p>
      </section>

      <section className="py-12 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.photos.map((p) => (
              <a
                key={p.fileId}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-lg overflow-hidden bg-light shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={p.url}
                  alt={p.alt || `${data.name} photo`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {p.blogTitle && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium line-clamp-2">{p.blogTitle}</p>
                    {p.blogDate && (
                      <p className="text-white/70 text-[10px] mt-0.5">
                        {new Date(p.blogDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </p>
                    )}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
