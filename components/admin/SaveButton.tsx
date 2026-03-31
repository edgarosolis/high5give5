interface SaveButtonProps {
  loading: boolean;
  onClick: () => void;
  label?: string;
}

export default function SaveButton({ loading, onClick, label = "Save Changes" }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-[#2A9D8F] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#1A7A6E] transition-colors disabled:opacity-50 text-sm"
    >
      {loading ? "Saving..." : label}
    </button>
  );
}
