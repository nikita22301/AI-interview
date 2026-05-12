// components/ui/AuthCard.tsx
import {WaveBorder} from "./WaveBorder"

interface AuthCardProps {
  children: React.ReactNode;
  maxWidth?: number;
  gradientId?: string;
  className?: string;
}

export function AuthCard({
  children,
  maxWidth = 460,
  gradientId = "waveGrad",
  className = "",
}: AuthCardProps) {
  return (
    <div className="auth-page">
      <div
        className={`auth-card ${className}`}
        style={{ maxWidth }}
      >
        <div className="corner-glow" />
        <WaveBorder gradientId={gradientId} />
        {children}
      </div>
    </div>
  );
}