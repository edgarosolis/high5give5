"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CountryForm from "@/components/admin/CountryForm";
import Link from "next/link";

export default function EditCountryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/countries/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setInitialData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSave(data: any): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/countries/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!initialData) {
    return <div className="text-gray-500">Country not found.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/countries" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Countries
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Edit: {initialData.name as string}
        </h1>
      </div>
      <CountryForm initialData={initialData} onSave={handleSave} />
    </div>
  );
}
