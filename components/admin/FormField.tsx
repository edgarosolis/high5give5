interface FormFieldProps {
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
}

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  options,
  rows = 3,
}: FormFieldProps) {
  const baseClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent outline-none";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={baseClass}
        />
      ) : type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={baseClass}
        >
          <option value="">Select...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={baseClass}
        />
      )}
    </div>
  );
}
