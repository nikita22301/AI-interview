"use client";

import styles from "./shared.module.css";

// ─── Wave Border ──────────────────────────────────────────────
// Reusable decorative SVG that appears in the top-right corner of every card.
// Pass a unique gradientId so multiple cards on the same page don't share <defs>.
export function WaveBorder({ gradientId = "waveGrad" }: { gradientId?: string }) {
  const filterId = `${gradientId}Glow`;
  const dots = [
    { cx: 220, cy: 18, r: 2.5 },
    { cx: 170, cy: 55, r: 2 },
    { cx: 148, cy: 105, r: 2.8 },
    { cx: 108, cy: 155, r: 1.8 },
    { cx: 55,  cy: 188, r: 2.2 },
  ];

  return (
    <svg
      className={styles.waveBorder}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="240" y1="0" x2="80" y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="45%"  stopColor="#7c3aed" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5b21b6" stopOpacity="0" />
        </linearGradient>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M240 0 C200 0, 160 10, 140 40 C120 70, 150 100, 120 130 C90 160, 40 155, 20 190 C10 207, 5 225, 0 240"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
        fill="none"
        filter={`url(#${filterId})`}
        strokeLinecap="round"
      />
      <path
        d="M240 0 C210 5, 175 20, 160 50 C145 80, 170 108, 148 138 C126 168, 75 162, 52 196 C38 215, 20 230, 0 240"
        stroke={`url(#${gradientId})`}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill="#c4b5fd"
          className={styles.waveDot}
          style={{
            animationDelay: `${i * 0.25}s`,
            animationDuration: `${1.5 + i * 0.4}s`,
          }}
        />
      ))}
    </svg>
  );
}

// ─── Auth Card ────────────────────────────────────────────────
// Wraps the dark page background + glassmorphism card.
// maxWidth defaults to 460px but can be overridden per page.
interface AuthCardProps {
  children: React.ReactNode;
  maxWidth?: number;
  gradientId?: string;
  className?: string;
}

export default function AuthCard({
  children,
  maxWidth = 460,
  gradientId = "waveGrad",
  className = "",
}: AuthCardProps) {
  return (
    <div className={styles.page}>
      <div
        className={`${styles.card} ${className}`}
        style={{ maxWidth }}
      >
        <div className={styles.cornerGlow} />
        <WaveBorder gradientId={gradientId} />
        {children}
      </div>
    </div>
  );
}