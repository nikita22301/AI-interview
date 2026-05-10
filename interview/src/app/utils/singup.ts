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

export type Step = "info" | "otp" | "password";

// ─── Validation ───────────────────────────────────────────────
export const validateName  = (v: string) => !v.trim() ? "Name is required" : v.trim().length < 2 ? "At least 2 characters" : "";
export const validateEmail = (v: string) => !v.trim() ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : "";
export const validatePass  = (v: string) => !v ? "Password is required" : v.length < 8 ? "Minimum 8 characters" : !/[A-Z]/.test(v) ? "Add an uppercase letter" : !/[0-9]/.test(v) ? "Add a number" : "";
export const validateConf  = (p: string, c: string) => !c ? "Please confirm your password" : p !== c ? "Passwords don't match" : "";

// ─── Sparkle Hook ─────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";

export function useSparkles(active: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
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