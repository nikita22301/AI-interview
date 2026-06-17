// components/ui/SparkleTextarea.tsx
"use client";

import { useState, useRef } from "react";
import { useSparkles, SparkleDots } from "./Sparkles";

interface SparkleTextareaProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}

export function SparkleTextarea({
  id,
  placeholder = "",
  value,
  onChange,
  rows = 3,
  className = "",
}: SparkleTextareaProps) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useSparkles(active, containerRef);

  return (
    <div
      ref={containerRef}
      className="sparkle-wrapper"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        if (document.activeElement?.id !== id) setActive(false);
      }}
    >
      <SparkleDots sparkles={sparkles} />
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        rows={rows}
        className={`textarea ${active ? "input-active" : ""} ${className}`}
      />
    </div>
  );
}