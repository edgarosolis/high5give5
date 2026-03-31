"use client";

import { useState, useEffect } from "react";
import SectionCard from "@/components/admin/SectionCard";
import FormField from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import Toast from "@/components/admin/Toast";

export default function ContactAdminPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const [contact, setContact] = useState({
    email: "info@high5give5.org",
    locationText: "Serving 22+ countries worldwide",
    socialLinks: {
      facebook: "#",
      instagram: "#",
      youtube: "#",
      twitter: "#",
    },
  });

  useEffect(() => {
    fetch("/api/admin/settings?section=contact-info")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.email) setContact(data);
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "contact-info", data: contact }),
      });
      setToast({ message: res.ok ? "Contact info saved!" : "Failed to save", type: res.ok ? "success" : "error" });
    } catch {
      setToast({ message: "Failed to save", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Info</h1>
          <p className="text-gray-500 mt-1">Manage contact details and social media links.</p>
        </div>
        <SaveButton loading={loading} onClick={handleSave} />
      </div>

      <SectionCard title="Contact Details">
        <FormField label="Email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} required />
        <FormField label="Location Text" value={contact.locationText} onChange={(v) => setContact({ ...contact, locationText: v })} />
      </SectionCard>

      <SectionCard title="Social Media Links" description="Enter full URLs. Use # for placeholder.">
        <FormField label="Facebook" value={contact.socialLinks.facebook} onChange={(v) => setContact({ ...contact, socialLinks: { ...contact.socialLinks, facebook: v } })} placeholder="https://facebook.com/high5give5" />
        <FormField label="Instagram" value={contact.socialLinks.instagram} onChange={(v) => setContact({ ...contact, socialLinks: { ...contact.socialLinks, instagram: v } })} placeholder="https://instagram.com/high5give5" />
        <FormField label="YouTube" value={contact.socialLinks.youtube} onChange={(v) => setContact({ ...contact, socialLinks: { ...contact.socialLinks, youtube: v } })} placeholder="https://youtube.com/@high5give5" />
        <FormField label="Twitter" value={contact.socialLinks.twitter} onChange={(v) => setContact({ ...contact, socialLinks: { ...contact.socialLinks, twitter: v } })} placeholder="https://twitter.com/high5give5" />
      </SectionCard>
    </div>
  );
}
