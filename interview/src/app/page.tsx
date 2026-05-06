"use client";

import { useState, useRef, useEffect } from "react";

// Sparkle particle type
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

// Hook to generate sparkles on hover/focus
function useSparkles(active: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
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
          const x = Math.random() * rect.width;
          const y = Math.random() * rect.height;
          const newSparkle: Sparkle = {
            id: idRef.current++,
            x,
            y,
            size: Math.random() * 6 + 3,
            opacity: 1,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(Math.random() * 1.5 + 0.5),
            life: 1,
          };
          setSparkles((prev) => [...prev.slice(-18), newSparkle]);
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

// Individual sparkle-wrapped input
function SparkleInput({
  type,
  placeholder,
  value,
  onChange,
  id,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useSparkles(active, containerRef);

  return (
    <div
      ref={containerRef}
      className="sparkle-wrapper"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={(e) => {
        const el = document.activeElement;
        if (el?.id !== id) setActive(false);
      }}
    >
      {/* Sparkles */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-dot"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className={`login-input ${active ? "input-active" : ""}`}
        autoComplete="off"
      />
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #050508;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        .page {
          min-height: 100vh;
          background: #050508;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Ambient bg glow */
        .page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 80% 10%, rgba(139, 92, 246, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 20% 80%, rgba(109, 40, 217, 0.07) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Subtle grid */
        .page::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .card {
          position: relative;
          width: 440px;
          padding: 48px 44px 44px;
          background: rgba(10, 10, 16, 0.85);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow:
            0 0 0 1px rgba(139,92,246,0.08),
            0 32px 80px rgba(0,0,0,0.7),
            0 8px 32px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          overflow: hidden;
          z-index: 1;
          animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Purple wave border — top-right */
        .wave-border {
          position: absolute;
          top: -1px;
          right: -1px;
          width: 240px;
          height: 240px;
          pointer-events: none;
          z-index: 2;
        }

        /* Glow dot inside top-right corner */
        .corner-glow {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%);
          pointer-events: none;
          animation: pulseGlow 3s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.12); }
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
          animation: fadeUp 0.5s 0.1s both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 20px rgba(124,58,237,0.5);
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #f0eaff;
          letter-spacing: -0.02em;
        }

        .brand-name span {
          color: #a78bfa;
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #f5f0ff;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin-bottom: 8px;
          animation: fadeUp 0.5s 0.15s both;
        }

        .subtitle {
          font-size: 14px;
          color: rgba(200,185,255,0.5);
          margin-bottom: 36px;
          font-weight: 300;
          animation: fadeUp 0.5s 0.2s both;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 12px;
          animation: fadeUp 0.5s 0.25s both;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(167,139,250,0.7);
          margin-bottom: 7px;
        }

        /* Sparkle wrapper */
        .sparkle-wrapper {
          position: relative;
          overflow: visible;
        }

        .sparkle-dot {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, #c4b5fd, #7c3aed);
          pointer-events: none;
          z-index: 10;
          box-shadow: 0 0 4px rgba(167,139,250,0.8);
          transform: translate(-50%, -50%);
          transition: opacity 0.1s;
        }

        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #f0eaff;
          outline: none;
          transition:
            border-color 0.25s,
            background 0.25s,
            box-shadow 0.25s;
          position: relative;
          z-index: 1;
        }

        .login-input::placeholder {
          color: rgba(200,185,255,0.25);
        }

        .login-input:hover,
        .login-input:focus,
        .input-active .login-input,
        .login-input.input-active {
          border-color: rgba(139,92,246,0.6);
          background: rgba(124,58,237,0.08);
          box-shadow:
            0 0 0 3px rgba(124,58,237,0.15),
            0 0 20px rgba(124,58,237,0.1);
        }

        .forgot {
          text-align: right;
          margin-top: -4px;
          margin-bottom: 28px;
          animation: fadeUp 0.5s 0.3s both;
        }

        .forgot a {
          font-size: 12px;
          color: rgba(167,139,250,0.6);
          text-decoration: none;
          transition: color 0.2s;
        }
        .forgot a:hover { color: #a78bfa; }

        .btn-login {
          width: 100%;
          padding: 14px;
          border-radius: 11px;
          border: none;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(124,58,237,0.4), 0 1px 4px rgba(0,0,0,0.3);
          animation: fadeUp 0.5s 0.35s both;
        }

        .btn-login::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(124,58,237,0.55), 0 2px 8px rgba(0,0,0,0.4);
        }

        .btn-login:active {
          transform: translateY(0);
        }

        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          animation: fadeUp 0.5s 0.4s both;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .divider span {
          font-size: 11px;
          color: rgba(200,185,255,0.3);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .btn-google {
          width: 100%;
          padding: 12px;
          border-radius: 11px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.04);
          color: rgba(240,234,255,0.8);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          animation: fadeUp 0.5s 0.45s both;
        }

        .btn-google:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.16);
          transform: translateY(-1px);
        }

        .register-row {
          text-align: center;
          margin-top: 28px;
          font-size: 13px;
          color: rgba(200,185,255,0.4);
          animation: fadeUp 0.5s 0.5s both;
        }

        .register-row a {
          color: #a78bfa;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .register-row a:hover {
          color: #c4b5fd;
        }

        @media (max-width: 480px) {
          .card { width: 92vw; padding: 36px 24px 32px; }
        }
      `}</style>

      <div className="page">
        <div className="card">
          {/* Corner glow */}
          <div className="corner-glow" />

          {/* Wave SVG border — top-right */}
          <svg className="wave-border" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="waveGrad" x1="240" y1="0" x2="80" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#7c3aed" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#5b21b6" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* Wave path flowing from top-right corner */}
            <path
              d="M240 0 C200 0, 160 10, 140 40 C120 70, 150 100, 120 130 C90 160, 40 155, 20 190 C10 207, 5 225, 0 240"
              stroke="url(#waveGrad)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              strokeLinecap="round"
            />
            <path
              d="M240 0 C210 5, 175 20, 160 50 C145 80, 170 108, 148 138 C126 168, 75 162, 52 196 C38 215, 20 230, 0 240"
              stroke="url(#waveGrad)"
              strokeWidth="0.8"
              fill="none"
              opacity="0.5"
              strokeLinecap="round"
            />
            {/* Sparkle stars on the wave */}
            {[
              { cx: 220, cy: 18, r: 2.5 },
              { cx: 170, cy: 55, r: 2 },
              { cx: 148, cy: 105, r: 2.8 },
              { cx: 108, cy: 155, r: 1.8 },
              { cx: 55, cy: 188, r: 2.2 },
            ].map((dot, i) => (
              <circle
                key={i}
                cx={dot.cx}
                cy={dot.cy}
                r={dot.r}
                fill="#c4b5fd"
                style={{
                  animation: `pulseGlow ${1.5 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.25}s`,
                }}
              />
            ))}
          </svg>

          {/* Brand */}
          <div className="brand">
            <div className="brand-icon">⚡</div>
            <span className="brand-name">Prep<span>IQ</span></span>
          </div>

          <h1>Welcome back</h1>
          <p className="subtitle">Sign in to continue your interview prep</p>

          {/* Fields */}
          <div className="field-group">
            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <SparkleInput
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <SparkleInput
                id="password"
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={setPassword}
              />
            </div>
          </div>

          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button className="btn-login" onClick={handleSubmit} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <div className="divider"><span>or</span></div>

          <button className="btn-google">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="register-row">
            Don&apos;t have an account? <a href="#">Create one free</a>
          </p>
        </div>
      </div>
    </>
  );
}