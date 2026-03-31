"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  countryCount: number;
  lastUpdated: string | null;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData>({
    countryCount: 0,
    lastUpdated: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/countries");
        if (res.ok) {
          const countries = await res.json();
          setData({
            countryCount: countries.length,
            lastUpdated: new Date().toLocaleDateString(),
          });
        }
      } catch {
        // Dashboard will show defaults
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const quickLinks = [
    {
      href: "/admin/global-stats",
      label: "Global Stats",
      description: "Update impact numbers",
      color: "bg-[#2A9D8F]",
    },
    {
      href: "/admin/homepage",
      label: "Homepage",
      description: "Edit hero, story & more",
      color: "bg-[#264653]",
    },
    {
      href: "/admin/countries",
      label: "Countries",
      description: "Manage country profiles",
      color: "bg-[#E76F51]",
    },
    {
      href: "/admin/about",
      label: "About Page",
      description: "Edit timeline & story",
      color: "bg-[#E9C46A]",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to the High5Give5 admin dashboard.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Countries</p>
          <p className="text-3xl font-bold text-[#264653] mt-1">
            {loading ? "..." : data.countryCount}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-lg font-semibold text-green-600 mt-1">Live</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Last Updated</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {loading ? "..." : data.lastUpdated || "—"}
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div
                className={`w-10 h-10 ${link.color} rounded-lg mb-3`}
              />
              <h3 className="font-semibold text-gray-900 group-hover:text-[#2A9D8F] transition-colors">
                {link.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
