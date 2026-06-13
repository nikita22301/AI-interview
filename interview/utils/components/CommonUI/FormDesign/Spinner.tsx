// components/ui/Spinner.tsx
export function Spinner({ className = "" }: { className?: string }) {
  return <span className={`spinner ${className}`} />;
}