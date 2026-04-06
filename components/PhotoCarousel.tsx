"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PhotoCarouselProps {
  images: string[];
  alt: string;
}

export default function PhotoCarousel({ images, alt }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);

  function next() {
    setCurrent((prev) => (prev + 1) % images.length);
  }

  function prev() {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }

  function getIndex(offset: number) {
    return (current + offset + images.length) % images.length;
  }

  if (images.length === 1) {
    return (
      <div className="mb-10">
        <div className="relative w-full h-72 md:h-[28rem] rounded-2xl overflow-hidden">
          <Image
            src={images[0]}
            alt={`${alt} - Photo 1`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </div>
    );
  }

  // Positions: far left, left, center, right, far right
  const positions = [
    { offset: -2, x: "-70%", z: -200, scale: 0.55, opacity: 0.3, blur: 6 },
    { offset: -1, x: "-35%", z: -100, scale: 0.75, opacity: 0.6, blur: 2 },
    { offset: 0, x: "0%", z: 0, scale: 1, opacity: 1, blur: 0 },
    { offset: 1, x: "35%", z: -100, scale: 0.75, opacity: 0.6, blur: 2 },
    { offset: 2, x: "70%", z: -200, scale: 0.55, opacity: 0.3, blur: 6 },
  ];

  // For 2-3 images, show fewer side cards
  const visiblePositions = images.length <= 3
    ? positions.filter((p) => Math.abs(p.offset) <= 1)
    : positions;

  return (
    <div className="mb-10">
      {/* 3D Carousel */}
      <div className="relative w-full h-72 md:h-[28rem]" style={{ perspective: "1200px" }}>
        <div className="relative w-full h-full flex items-center justify-center">
          {visiblePositions.map((pos) => {
            const idx = getIndex(pos.offset);
            return (
              <motion.div
                key={`${pos.offset}-${idx}`}
                animate={{
                  x: pos.x,
                  z: pos.z,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  filter: `blur(${pos.blur}px)`,
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute w-[75%] md:w-[65%] h-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                style={{
                  zIndex: 10 - Math.abs(pos.offset) * 2,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (pos.offset === -1 || pos.offset === -2) prev();
                  else if (pos.offset === 1 || pos.offset === 2) next();
                }}
              >
                <Image
                  src={images[idx]}
                  alt={`${alt} - Photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 75vw, 65vw"
                  priority={pos.offset === 0}
                />
                {/* Dark overlay on side cards */}
                {pos.offset !== 0 && (
                  <div className="absolute inset-0 bg-black/20" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Arrow buttons */}
        <button
          onClick={prev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-20"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-20"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Counter badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full z-20">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-2.5 bg-[#2A9D8F]"
                : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
