"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { countries, type Country } from "@/lib/countries";

// Robinson projection lookup table (standard parallels)
const ROBINSON_TABLE: [number, number, number][] = [
  [0, 1.0000, 0.0000],
  [5, 0.9986, 0.0620],
  [10, 0.9954, 0.1240],
  [15, 0.9900, 0.1860],
  [20, 0.9822, 0.2480],
  [25, 0.9730, 0.3100],
  [30, 0.9600, 0.3720],
  [35, 0.9427, 0.4340],
  [40, 0.9216, 0.4958],
  [45, 0.8962, 0.5571],
  [50, 0.8679, 0.6176],
  [55, 0.8350, 0.6769],
  [60, 0.7986, 0.7346],
  [65, 0.7597, 0.7903],
  [70, 0.7186, 0.8435],
  [75, 0.6732, 0.8936],
  [80, 0.6213, 0.9394],
  [85, 0.5722, 0.9761],
  [90, 0.5322, 1.0000],
];

function robinsonProject(lat: number, lng: number): { x: number; y: number } {
  const absLat = Math.abs(lat);
  const sign = lat < 0 ? -1 : 1;

  // Interpolate Robinson table
  let i = Math.floor(absLat / 5);
  if (i >= ROBINSON_TABLE.length - 1) i = ROBINSON_TABLE.length - 2;
  const frac = (absLat - ROBINSON_TABLE[i][0]) / 5;
  const plen = ROBINSON_TABLE[i][1] + (ROBINSON_TABLE[i + 1][1] - ROBINSON_TABLE[i][1]) * frac;
  const pdfe = ROBINSON_TABLE[i][2] + (ROBINSON_TABLE[i + 1][2] - ROBINSON_TABLE[i][2]) * frac;

  // Map to SVG viewBox 0 0 1000 507
  const x = 500 + (lng / 180) * plen * 500 * 0.8487;
  const y = 253.5 - sign * pdfe * 253.5 * 1.3523;

  return { x, y };
}

function MapPin({
  country,
  index,
  isActive,
  onHover,
  onClick,
}: {
  country: Country;
  index: number;
  isActive: boolean;
  onHover: (c: Country | null) => void;
  onClick: (c: Country) => void;
}) {
  const { x, y } = robinsonProject(country.lat, country.lng);

  return (
    <g
      onMouseEnter={() => onHover(country)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(country)}
      className="cursor-pointer"
    >
      {/* Pulse ring */}
      <motion.circle
        cx={x}
        cy={y}
        r={8}
        fill="none"
        stroke="#2A9D8F"
        strokeWidth={1.5}
        initial={{ r: 4, opacity: 0 }}
        animate={{ r: [6, 14, 6], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.08 }}
      />
      {/* Drop shadow */}
      <motion.circle
        cx={x}
        cy={y + 1}
        r={5}
        fill="rgba(0,0,0,0.3)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 + index * 0.05 }}
        style={{ transformOrigin: `${x}px ${y + 1}px` }}
      />
      {/* Main dot */}
      <motion.circle
        cx={x}
        cy={y}
        r={isActive ? 7 : 5}
        fill={isActive ? "#E9C46A" : "#2A9D8F"}
        stroke="white"
        strokeWidth={2}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
          delay: 0.3 + index * 0.05,
        }}
        whileHover={{ scale: 1.4 }}
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
    </g>
  );
}

export default function InteractiveMap() {
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const router = useRouter();

  const handleHover = useCallback((country: Country | null) => {
    setActiveCountry(country);
    if (country) {
      const { x, y } = robinsonProject(country.lat, country.lng);
      setTooltipPos({ x, y });
    }
  }, []);

  const handleClick = useCallback(
    (country: Country) => {
      router.push(`/our-work/${country.slug}`);
    },
    [router]
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative w-full"
    >
      <div className="relative bg-secondary rounded-2xl overflow-hidden shadow-2xl">
        {/* Real world map SVG as background with pin overlay */}
        <svg viewBox="0 0 1000 507" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Dark background */}
          <rect width="1000" height="507" fill="#264653" />

          {/* Grid lines */}
          <g stroke="#2A9D8F" strokeWidth="0.3" strokeOpacity="0.06">
            {[...Array(9)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={(i + 1) * 50.7} x2="1000" y2={(i + 1) * 50.7} />
            ))}
            {[...Array(19)].map((_, i) => (
              <line key={`v${i}`} x1={(i + 1) * 50} y1="0" x2={(i + 1) * 50} y2="507" />
            ))}
          </g>

          {/* Real world map loaded as image */}
          <image
            href="/world-map-styled.svg"
            x="0"
            y="0"
            width="1000"
            height="507"
            opacity="0.2"
          />

          {/* Animated pins */}
          {inView &&
            countries.map((country, index) => (
              <MapPin
                key={country.slug}
                country={country}
                index={index}
                isActive={activeCountry?.slug === country.slug}
                onHover={handleHover}
                onClick={handleClick}
              />
            ))}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {activeCountry && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none z-20"
              style={{
                left: `${(tooltipPos.x / 1000) * 100}%`,
                top: `${(tooltipPos.y / 507) * 100}%`,
                transform: "translate(-50%, -130%)",
              }}
            >
              <div className="bg-white rounded-xl shadow-xl p-3 min-w-[200px] border border-light">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={activeCountry.imageUrl}
                      alt={activeCountry.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-sm">
                      {activeCountry.name}
                    </h4>
                    <p className="text-xs text-muted">{activeCountry.projectType}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">
                    $5 = {activeCountry.mealsPerFive} meals
                  </span>
                  <span className="text-muted">
                    {activeCountry.childrenFed} fed
                  </span>
                </div>
                <div className="mt-1.5 text-[10px] text-center text-primary font-medium">
                  Click to learn more →
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-3 h-3 bg-white border-r border-b border-light rotate-45 -mt-1.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-white/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-primary rounded-full inline-block" />
            Active programs
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-accent rounded-full inline-block" />
            Hover / Selected
          </div>
        </div>

        {/* Country count badge */}
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full">
          {countries.length} Countries Served
        </div>
      </div>
    </motion.div>
  );
}
