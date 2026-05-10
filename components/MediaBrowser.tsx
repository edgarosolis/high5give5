"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Video, VideoCategory } from "@/lib/videos";

type Props = {
  featured: Video;
  categories: VideoCategory[];
};

export default function MediaBrowser({ featured, categories }: Props) {
  const [active, setActive] = useState<Video | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <Hero video={featured} onPlay={() => setActive(featured)} />

      <div className="bg-bg pb-16 -mt-12 relative z-10">
        {categories.map((cat) => (
          <Row key={cat.name} category={cat} onPick={setActive} />
        ))}
      </div>

      {active && <PlayerModal video={active} onClose={() => setActive(null)} />}
    </>
  );
}

function Hero({ video, onPlay }: { video: Video; onPlay: () => void }) {
  return (
    <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden bg-secondary">
      <Image
        src={video.thumbnail}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover scale-110 blur-[2px] opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-secondary/70 to-secondary/40" />
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
          <p className="text-accent text-sm font-semibold tracking-wider uppercase mb-3">
            Featured story
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white drop-shadow-lg max-w-2xl">
            {video.name}
          </h1>
          <p className="text-white/80 text-base md:text-lg mt-4 max-w-xl">
            Stories from the field — kids, partners, and communities we serve.
          </p>
          <div className="flex gap-3 mt-7">
            <button
              type="button"
              onClick={onPlay}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-secondary font-semibold hover:bg-white/90 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>
            <a
              href="#all-stories"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-7 py-3 text-white font-semibold hover:bg-white/25 transition-colors"
            >
              Browse all
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  category,
  onPick,
}: {
  category: VideoCategory;
  onPick: (v: Video) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <section
      id={category.name === categoryAnchor ? "all-stories" : undefined}
      className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-14"
    >
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary mb-4">
        {category.name}
      </h2>
      <div className="relative group">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll(-1)}
          className="hidden md:flex absolute left-0 top-0 bottom-0 z-10 w-10 items-center justify-center bg-gradient-to-r from-bg via-bg/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-7 h-7 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll(1)}
          className="hidden md:flex absolute right-0 top-0 bottom-0 z-10 w-10 items-center justify-center bg-gradient-to-l from-bg via-bg/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-7 h-7 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {category.videos.map((v) => (
            <Card key={v.slug} video={v} onClick={() => onPick(v)} />
          ))}
        </div>
      </div>
    </section>
  );
}

const categoryAnchor = "Children's Voices"; // first category gets the #all-stories anchor

function Card({ video, onClick }: { video: Video; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/card relative shrink-0 snap-start w-[260px] md:w-[320px] aspect-video rounded-lg overflow-hidden bg-light shadow-sm hover:shadow-2xl hover:scale-[1.04] transition-all duration-300 text-left"
    >
      <Image
        src={video.thumbnail}
        alt={video.name}
        fill
        sizes="320px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
        <span className="rounded-full bg-white/95 w-14 h-14 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-secondary ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <p className="text-white font-semibold text-sm md:text-base leading-tight line-clamp-2 drop-shadow">
          {video.name}
        </p>
      </div>
    </button>
  );
}

function PlayerModal({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.name}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-0 text-white/80 hover:text-white flex items-center gap-2 text-sm"
        >
          Close
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            key={video.slug}
            src={video.embedUrl}
            title={video.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <h2 className="text-white font-serif text-xl md:text-2xl mt-4">{video.name}</h2>
      </div>
    </div>
  );
}
