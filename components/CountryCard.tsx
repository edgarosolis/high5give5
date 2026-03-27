import Image from "next/image";
import Link from "next/link";
import type { Country } from "@/lib/countries";

export default function CountryCard({ country }: { country: Country }) {
  return (
    <Link
      href={`/our-work/${country.slug}`}
      className="group block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={country.imageUrl}
          alt={country.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
            {country.projectType}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-bold text-secondary">
          {country.name}
        </h3>
        <p className="text-muted text-sm mt-1 line-clamp-2">
          {country.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>$5 = {country.mealsPerFive} meals</span>
          <span>{country.childrenFed} children fed</span>
        </div>
      </div>
    </Link>
  );
}
