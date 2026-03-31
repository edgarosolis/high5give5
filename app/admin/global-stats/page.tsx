"use client";

import { useState, useEffect, useCallback } from "react";
import SectionCard from "@/components/admin/SectionCard";
import FormField from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import Toast from "@/components/admin/Toast";

export default function GlobalStatsPage() {
  const [stats, setStats] = useState({
    countriesServed: 22,
    childrenFed: 6000,
    elderlyServed: 2000,
    mealsPerFive: 50,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings?section=global-stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.countriesServed) setStats(data);
      })
      .catch(() => {});
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "global-stats", data: stats }),
      });
      if (res.ok) {
        setToast({ message: "Global stats saved!", type: "success" });
      } else {
        setToast({ message: "Failed to save", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to save", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [stats]);

  return (
    <div className="max-w-2xl space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Stats</h1>
          <p className="text-gray-500 mt-1">These numbers appear on the homepage and Our Work page.</p>
        </div>
        <SaveButton loading={loading} onClick={handleSave} />
      </div>

      <SectionCard title="Impact Numbers">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Countries Served"
            type="number"
            value={stats.countriesServed}
            onChange={(v) => setStats({ ...stats, countriesServed: Number(v) })}
            required
          />
          <FormField
            label="Children Fed"
            type="number"
            value={stats.childrenFed}
            onChange={(v) => setStats({ ...stats, childrenFed: Number(v) })}
            required
          />
          <FormField
            label="Elderly Served"
            type="number"
            value={stats.elderlyServed}
            onChange={(v) => setStats({ ...stats, elderlyServed: Number(v) })}
            required
          />
          <FormField
            label="Meals per $5"
            type="number"
            value={stats.mealsPerFive}
            onChange={(v) => setStats({ ...stats, mealsPerFive: Number(v) })}
            required
          />
        </div>
      </SectionCard>
    </div>
  );
}
