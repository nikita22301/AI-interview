// components/ui/WaveBorder.tsx
interface WaveBorderProps {
  gradientId?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function WaveBorder({ 
  gradientId = "waveGrad", 
  className = "",
  width = 240,
  height = 240,
}: WaveBorderProps) {
  const dots = [
    { cx: width * 0.92, cy: height * 0.075, r: 2.5 },
    { cx: width * 0.71, cy: height * 0.23, r: 2 },
    { cx: width * 0.62, cy: height * 0.44, r: 2.8 },
    { cx: width * 0.45, cy: height * 0.65, r: 1.8 },
    { cx: width * 0.23, cy: height * 0.78, r: 2.2 },
  ];

  const filterId = `${gradientId}Glow`;

  return (
    <svg
      className={`wave-border ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1={width} y1="0"
          x2={width * 0.33} y2={height * 0.75}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#7c3aed" stopOpacity="0.6" />
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
        d={`M${width} 0 C${width * 0.83} 0, ${width * 0.67} ${height * 0.04}, ${width * 0.58} ${height * 0.17} C${width * 0.5} ${height * 0.29}, ${width * 0.63} ${height * 0.42}, ${width * 0.5} ${height * 0.54} C${width * 0.38} ${height * 0.67}, ${width * 0.17} ${height * 0.65}, ${width * 0.08} ${height * 0.79} C${width * 0.04} ${height * 0.86}, ${width * 0.02} ${height * 0.94}, 0 ${height}`}
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
        fill="none"
        filter={`url(#${filterId})`}
        strokeLinecap="round"
      />
      <path
        d={`M${width} 0 C${width * 0.88} ${height * 0.02}, ${width * 0.73} ${height * 0.08}, ${width * 0.67} ${height * 0.21} C${width * 0.6} ${height * 0.33}, ${width * 0.71} ${height * 0.45}, ${width * 0.62} ${height * 0.58} C${width * 0.53} ${height * 0.7}, ${width * 0.31} ${height * 0.68}, ${width * 0.22} ${height * 0.82} C${width * 0.16} ${height * 0.9}, ${width * 0.08} ${height * 0.96}, 0 ${height}`}
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
          className="wave-dot"
          style={{
            animationDelay: `${i * 0.25}s`,
            animationDuration: `${1.5 + i * 0.4}s`,
          }}
        />
      ))}
    </svg>
  );
}