// components/ui/PillGroup.tsx
interface PillGroupProps {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  className?: string;
}

export function PillGroup({
  options,
  selected,
  onToggle,
  className = "",
}: PillGroupProps) {
  return (
    <div className={`pills-grid ${className}`}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={`pill ${selected.includes(opt) ? "pill-active" : ""}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}