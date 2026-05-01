import Image from "next/image";
import Link from "next/link";
import { getAllCountryMedia } from "@/lib/media";

export default function MediaPage() {
  const countries = getAllCountryMedia().filter((c) => c.photoCount > 0);
  const totalPhotos = countries.reduce((n, c) => n + c.photoCount, 0);

  return (
    <div>
      <section className="bg-secondary h-64 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">Media</h1>
        <p className="text-white/80 text-lg">
          {totalPhotos.toLocaleString()} photos from {countries.length} countries
        </p>
      </section>

      <section className="py-16 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.map((c) => (
              <Link
                key={c.slug}
                href={`/media/${c.slug}`}
                className="group block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  {c.cover ? (
                    <Image
                      src={c.cover}
                      alt={c.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-light" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <h3 className="font-serif text-2xl font-bold text-white drop-shadow-md">
                      {c.name}
                    </h3>
                    <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {c.photoCount} photos
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
