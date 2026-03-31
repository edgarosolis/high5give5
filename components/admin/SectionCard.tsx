interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
