"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../../public/loginpage.module.css"
import { FaBolt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Logo from "./components/CommonUI/logo"
import { loginUser } from "../app/api/login";
import Loading from "./components/CommonUI/loading";
import Link from "next/link";
import {
  validateInfoStep,
  validateOtp,
  validatePasswordStep,
  InfoErrors,
  PasswordErrors,
  hasErrors,
  validateLoginForm,
  validateEmail,
} from "./utils/validation";
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

// ─── Sparkle Input ────────────────────────────────────────────
function SparkleInput({
  type, placeholder, value, onChange, onBlur, id, error,
}: {
  type: string; placeholder: string; value: string;
  onChange: (v: string) => void;
  onBlur?: (v: string) => void;  // ← add
  id: string;
  error?: string;                // ← add
}) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useSparkles(active, containerRef);

  return (
    <div
      ref={containerRef}
      className={styles.sparkleWrapper}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => { if (document.activeElement?.id !== id) setActive(false); }}
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          className={styles.sparkleDot}
          style={{ left: s.x, top: s.y, width: s.size, height: s.size, opacity: s.opacity }}
        />
      ))}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={(e) => {
          setActive(false);
          onBlur?.(e.target.value); // ← trigger validation
        }}
        autoComplete="off"
        className={[
          styles.input,
          "rounded-[10px] px-4 py-[13px] text-sm",
          active ? styles.inputActive : "",
          error ? styles.inputError : "",
        ].join(" ")}
      />
    </div>
  );
}

// ─── Wave SVG ─────────────────────────────────────────────────
function WaveBorder() {
  const dots = [
    { cx: 220, cy: 18, r: 2.5 }, { cx: 170, cy: 55, r: 2 },
    { cx: 148, cy: 105, r: 2.8 }, { cx: 108, cy: 155, r: 1.8 }, { cx: 55, cy: 188, r: 2.2 },
  ];
  return (
    <svg className={styles.waveBorder} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="waveGradLogin" x1="240" y1="0" x2="80" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#7c3aed" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5b21b6" stopOpacity="0" />
        </linearGradient>
        <filter id="glowLogin">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        d="M240 0 C200 0, 160 10, 140 40 C120 70, 150 100, 120 130 C90 160, 40 155, 20 190 C10 207, 5 225, 0 240"
        stroke="url(#waveGradLogin)" strokeWidth="1.5" fill="none" filter="url(#glowLogin)" strokeLinecap="round"
      />
      <path
        d="M240 0 C210 5, 175 20, 160 50 C145 80, 170 108, 148 138 C126 168, 75 162, 52 196 C38 215, 20 230, 0 240"
        stroke="url(#waveGradLogin)" strokeWidth="0.8" fill="none" opacity="0.5" strokeLinecap="round"
      />
      {dots.map((d, i) => (
        <circle
          key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#c4b5fd"
          className={styles.waveDot}
          style={{ animationDelay: `${i * 0.25}s`, animationDuration: `${1.5 + i * 0.4}s` }}
        />
      ))}
    </svg>
  );
}

// ─── Google Icon ──────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });


  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(email, password);

    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      console.log(data);
      localStorage.setItem("email", email);
      localStorage.setItem("token", data.token);

      router.push("/dashboard");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };



  // if(!loading){
  //   return <Loading/>
  // }
  return (
    <div className={styles.page}>
      {/* Card */}
      <div className={`${styles.card} w-full max-w-[440px] rounded-[20px] px-11 py-12 mx-4`}>
        <div className={styles.cornerGlow} />
        <WaveBorder />

        {/* Brand */}
        <Logo />

        {/* Heading */}
        <h1 className={`${styles.fadeUp2} mb-2 font-['Syne'] text-[28px] font-extrabold leading-tight tracking-tight text-[#f5f0ff]`}>
          Welcome back
        </h1>
        <p className={`${styles.fadeUp3} mb-9 text-sm font-light text-purple-200/50`}>
          Sign in to continue your interview prep
        </p>

        {/* Fields */}
        <div className={`${styles.fadeUp4} flex flex-col gap-5 mb-3`}>
          <div>
            <label htmlFor="email" className={styles.fieldLabel}>Email</label>
            <SparkleInput
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(v) => {
                setEmail(v);
                // Clear error live once user starts fixing it
                if (errors.email) setErrors((prev) => ({ ...prev, email: validateEmail(v) }));
              }}
              onBlur={(v) => {
                // Validate when user leaves the field
                setErrors((prev) => ({ ...prev, email: validateEmail(v) }));
              }}
              error={errors.email}
            /> {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className={styles.fieldLabel}>Password</label>
            <SparkleInput
              id="password"
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(v) => {
                setPassword(v);
                // Clear error once they start typing
                if (errors.password) setErrors((prev) => ({ ...prev, password: v ? "" : "Password is required" }));
              }}
              onBlur={(v) => {
                setErrors((prev) => ({ ...prev, password: v ? "" : "Password is required" }));
              }}
              error={errors.password}
            />  {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* Forgot */}
        <div className={`${styles.fadeUp5} mb-7 text-right`}>
          <Link href="/forgotPassword" className="text-[12px] text-violet-400/60 no-underline transition-colors hover:text-violet-400">
            Forgot password?
          </Link>
        </div>

        {/* Sign in button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${styles.btnPrimary} ${styles.fadeUp6} w-full cursor-pointer rounded-[11px] border-0 py-3.5 font-['Syne'] text-[15px] font-bold tracking-wide text-white`}
        >
          {loading && <span className={styles.spinner} />}
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {/* Divider */}
        <div className={`${styles.divider} ${styles.fadeUp7} my-6`}>
          <span className="text-[11px] uppercase tracking-widest text-purple-200/30">or</span>
        </div>

        {/* Google button */}
        <button
          className={`${styles.btnGoogle} ${styles.fadeUp8} flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[11px] border-0 py-3 text-sm font-medium`}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Register link */}
        <p className={`${styles.fadeUp9} mt-7 text-center text-[13px] text-purple-200/40`}>
          Don&apos;t have an account?{" "}
          <a href="/signup" className="font-medium text-violet-400 no-underline transition-colors hover:text-violet-300">
            Create one free
          </a>
        </p>
      </div>
    </div>
  );
}