"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

function AnimatedNumber({
  target,
  duration = 2000,
  prefix = "",
  suffix = "",
  inView,
}: {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { target: 22, suffix: "+", label: "Countries" },
  { target: 6000, suffix: "+", label: "Children Fed" },
  { target: 2000, suffix: "+", label: "Elderly Served" },
  { target: 50, prefix: "$5 = ", label: "Meals", suffix: "" },
];

export default function ImpactCounter() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section id="impact" className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {stat.label === "Meals" ? (
                  <span>
                    $5 ={" "}
                    <AnimatedNumber
                      target={stat.target}
                      inView={inView}
                    />
                  </span>
                ) : (
                  <AnimatedNumber
                    target={stat.target}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    inView={inView}
                  />
                )}
              </div>
              <div className="text-muted text-sm font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
