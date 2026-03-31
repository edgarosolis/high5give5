"use client";

import { useRouter } from "next/navigation";
import CountryForm from "@/components/admin/CountryForm";
import Link from "next/link";

export default function NewCountryPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSave(data: any): Promise<boolean> {
    try {
      const res = await fetch("/api/admin/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/admin/countries");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/countries" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Countries
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Country</h1>
      </div>
      <CountryForm isNew onSave={handleSave} />
    </div>
  );
}
