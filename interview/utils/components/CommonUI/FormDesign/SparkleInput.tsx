// components/ui/SparkleInput.tsx
"use client";

import { useState, useRef } from "react";
import { useSparkles, SparkleDots } from "./Sparkles";

interface SparkleInputProps {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  className?: string;
}

export function SparkleInput({
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  autoComplete = "off",
  className = "",
}: SparkleInputProps) {
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
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        autoComplete={autoComplete}
        className={`input ${active ? "input-active" : ""} ${className}`}
      />
    </div>
  );
}