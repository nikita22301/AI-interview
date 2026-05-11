"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./shared.module.css";

// ─── Types ────────────────────────────────────────────────────
interface Sparkle {
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
function useSparkles(
  active: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const animRef = useRef<number | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setSparkles([]);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
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
          .map((s) => ({
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy,
            life: s.life - 0.035,
            opacity: s.life - 0.035,
          }))
          .filter((s) => s.life > 0)
      );
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active, containerRef]);

  return sparkles;
}

// ─── Sparkle Dots renderer (shared) ──────────────────────────
function SparkleDots({ sparkles }: { sparkles: Sparkle[] }) {
  return (
    <>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className={styles.sparkleDot}
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </>
  );
}

// ─── SparkleInput ─────────────────────────────────────────────
interface SparkleInputProps {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}

export function SparkleInput({
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  autoComplete = "off",
}: SparkleInputProps) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useSparkles(active, containerRef);

  return (
    <div
      ref={containerRef}
      className={styles.sparkleWrapper}
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
        className={[styles.input, active ? styles.inputActive : ""].join(" ")}
      />
    </div>
  );
}

// ─── SparkleTextarea ─────────────────────────────────────────
interface SparkleTextareaProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function SparkleTextarea({
  id,
  placeholder = "",
  value,
  onChange,
  rows = 3,
}: SparkleTextareaProps) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useSparkles(active, containerRef);

  return (
    <div
      ref={containerRef}
      className={styles.sparkleWrapper}
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
        className={[
          styles.textarea,
          active ? styles.inputActive : "",
        ].join(" ")}
      />
    </div>
  );
}