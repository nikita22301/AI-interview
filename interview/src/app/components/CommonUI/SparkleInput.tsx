"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./style/SparkleInput.module.css";

// ─── Types ────────────────────────────────────────────────────
export interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
}

// ─── Sparkle Hook ─────────────────────────────────────────────
export function useSparkles(active: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const animRef = useRef<number | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const frame = requestAnimationFrame(() => setSparkles([]));
      return () => cancelAnimationFrame(frame);
    }

    let lastSpawn = 0;
    const loop = (time: number) => {
      if (time - lastSpawn > 80) {
        lastSpawn = time;
        const el = containerRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          setSparkles((prev) => [
            ...prev.slice(-18),
            {
              id: idRef.current++,
              x: Math.random() * rect.width,
              y: Math.random() * rect.height,
              size: Math.random() * 6 + 3,
              opacity: 1,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -(Math.random() * 1.5 + 0.5),
              life: 1,
            },
          ]);
        }
      }
      setSparkles((prev) =>
        prev
          .map((s) => ({ ...s, x: s.x + s.vx, y: s.y + s.vy, life: s.life - 0.035, opacity: s.life - 0.035 }))
          .filter((s) => s.life > 0)
      );
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active, containerRef]);

  return sparkles;
}

// ─── Eye Icon Component ───────────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Reusable SparkleInput ─────────────────────────────────────
interface SparkleInputProps {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  autoComplete?: string;
  error?: string;
  className?: string;
  showPasswordToggle?: boolean;
}

export default function SparkleInput({
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  autoComplete = "off",
  error,
  className = "",
  showPasswordToggle = false,
}: SparkleInputProps) {
  const [active, setActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useSparkles(active, containerRef);

  const inputType = showPasswordToggle && type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={styles.sparkleWrapper}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => {
          if (document.activeElement?.id !== id) setActive(false);
        }}
      >
        {sparkles.map((s) => (
          <span
            key={s.id}
            className={styles.sparkleDot}
            style={{ left: s.x, top: s.y, width: s.size, height: s.size, opacity: s.opacity }}
          />
        ))}
        
        <div className={styles.inputWrap}>
          <input
            id={id}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setActive(true)}
            onBlur={(e) => {
              setActive(false);
              onBlur?.(e.target.value);
            }}
            autoComplete={autoComplete}
            className={[
              styles.input,
              active ? styles.inputActive : "",
              error ? styles.inputError : "",
              className
            ].join(" ")}
          />

          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className={styles.eyeBtn}
            >
              <EyeIcon open={showPassword} />
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className={styles.errorMsg}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
