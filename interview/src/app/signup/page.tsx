"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Signuppage.module.css"

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

type Step = "info" | "otp" | "password";

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
  type, placeholder, value, onChange, id, error,
}: {
  type: string; placeholder: string; value: string;
  onChange: (v: string) => void; id: string; error?: string;
}) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useSparkles(active, containerRef);

  return (
    <div>
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
          onBlur={() => setActive(false)}
          autoComplete="off"
          className={[
            styles.input,
            "rounded-[10px] px-4 py-[13px] text-sm",
            active ? styles.inputActive : "",
            error ? styles.inputError : "",
          ].join(" ")}
        />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-400">
          <span className="text-[10px]">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ─── OTP Input ────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (value[i]) { const n = [...value]; n[i] = ""; onChange(n); }
      else if (i > 0) { refs[i - 1].current?.focus(); const n = [...value]; n[i - 1] = ""; onChange(n); }
    }
    if (e.key === "ArrowLeft" && i > 0) refs[i - 1].current?.focus();
    if (e.key === "ArrowRight" && i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...value];
    pasted.split("").forEach((d, i) => { if (i < 6) next[i] = d; });
    onChange(next);
    refs[Math.min(pasted.length, 5)].current?.focus();
  };

  return (
    <div className="mt-1 grid grid-cols-6 gap-2 sm:gap-2.5">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          autoComplete="one-time-code"
          className={[
            styles.otpBox,
            "rounded-[10px] text-center text-xl font-bold",
            value[i] ? styles.otpFilled : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────
function StepIndicator({ step }: { step: Step }) {
  const steps: Step[] = ["info", "otp", "password"];
  const idx = steps.indexOf(step);
  const labels = ["Your info", "Verify email", "Set password"];

  return (
    <div className="mb-7 flex items-center">
      {steps.map((s, i) => (
        <div key={s} className="flex flex-1 last:flex-none items-center gap-1.5">
          <div className={[
            styles.stepDot,
            "flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
            i < idx ? styles.stepDotDone : i === idx ? styles.stepDotActive : "",
          ].join(" ")}>
            {i < idx ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : <span>{i + 1}</span>}
          </div>
          <span className={[
            "hidden text-[10px] font-medium tracking-wide sm:inline",
            i === idx ? "text-violet-300/80" : "text-purple-200/30",
          ].join(" ")}>
            {labels[i]}
          </span>
          {i < 2 && (
            <div className={[styles.stepLine, "mx-1.5 h-px flex-1", i < idx ? styles.stepLineDone : ""].join(" ")} />
          )}
        </div>
      ))}
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
        <linearGradient id="waveGradSU" x1="240" y1="0" x2="80" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#7c3aed" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5b21b6" stopOpacity="0" />
        </linearGradient>
        <filter id="glowSU">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M240 0 C200 0, 160 10, 140 40 C120 70, 150 100, 120 130 C90 160, 40 155, 20 190 C10 207, 5 225, 0 240"
        stroke="url(#waveGradSU)" strokeWidth="1.5" fill="none" filter="url(#glowSU)" strokeLinecap="round" />
      <path d="M240 0 C210 5, 175 20, 160 50 C145 80, 170 108, 148 138 C126 168, 75 162, 52 196 C38 215, 20 230, 0 240"
        stroke="url(#waveGradSU)" strokeWidth="0.8" fill="none" opacity="0.5" strokeLinecap="round" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#c4b5fd"
          className={styles.waveDot}
          style={{ animationDelay: `${i * 0.25}s`, animationDuration: `${1.5 + i * 0.4}s` }}
        />
      ))}
    </svg>
  );
}

// ─── Password Strength ────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Special char", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const color = score <= 1 ? "#ef4444" : score === 2 ? "#f97316" : score === 3 ? "#eab308" : "#22c55e";
  const label = ["", "Weak", "Fair", "Good", "Strong"][score];
  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={styles.strengthSeg} style={{ background: i < score ? color : "rgba(255,255,255,0.08)" }} />
        ))}
        <span className="ml-1.5 min-w-[42px] text-[11px] font-semibold tracking-wide transition-colors" style={{ color }}>
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((c) => (
          <span key={c.label} className={["text-[11px] transition-colors", c.ok ? "text-violet-300/80" : "text-purple-200/30"].join(" ")}>
            {c.ok ? "✓" : "·"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Eye Icon ─────────────────────────────────────────────────
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

// ─── Validation ───────────────────────────────────────────────
const validateName  = (v: string) => !v.trim() ? "Name is required" : v.trim().length < 2 ? "At least 2 characters" : "";
const validateEmail = (v: string) => !v.trim() ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : "";
const validatePass  = (v: string) => !v ? "Password is required" : v.length < 8 ? "Minimum 8 characters" : !/[A-Z]/.test(v) ? "Add an uppercase letter" : !/[0-9]/.test(v) ? "Add a number" : "";
const validateConf  = (p: string, c: string) => !c ? "Please confirm your password" : p !== c ? "Passwords don't match" : "";

// ─── Main Page ────────────────────────────────────────────────
export default function SignupPage() {
  const [step, setStep]       = useState<Step>("info");
  const [animKey, setAnimKey] = useState(0);

  // Step 1
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [err1, setErr1]   = useState({ name: "", email: "" });

  // Step 2
  const [otp, setOtp]             = useState<string[]>(Array(6).fill(""));
  const [otpErr, setOtpErr]       = useState("");
  const [timer, setTimer]         = useState(30);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Step 3
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [err3, setErr3]         = useState({ password: "", confirm: "" });

  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  useEffect(() => {
    if (step !== "otp") return;
    setTimer(30); setCanResend(false);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const goTo = (s: Step) => { setStep(s); setAnimKey((k) => k + 1); };

  const handleInfo = () => {
    const ne = validateName(name), ee = validateEmail(email);
    setErr1({ name: ne, email: ee });
    if (ne || ee) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); goTo("otp"); }, 1200);
  };

  const handleOtp = () => {
    if (otp.join("").length < 6) { setOtpErr("Enter all 6 digits"); return; }
    setOtpErr("");
    setLoading(true);
    setTimeout(() => { setLoading(false); goTo("password"); }, 1200);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(6).fill("")); setOtpErr("");
    setCanResend(false); setTimer(30);
    timerRef.current = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(timerRef.current!); setCanResend(true); return 0; } return t - 1; });
    }, 1000);
  };

  const handlePassword = () => {
    const pe = validatePass(password), ce = validateConf(password, confirm);
    setErr3({ password: pe, confirm: ce });
    if (pe || ce) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
  };

  // ── Success screen ─────────────────────────────────────────
  if (done) return (
    <div className={`${styles.page} relative flex min-h-screen items-center justify-center bg-[#050508] px-4 py-6`}>
      <div className={`${styles.card} relative w-full max-w-[420px] overflow-hidden rounded-[20px] p-12 text-center`}>
        <div className={styles.cornerGlow} />
        <WaveBorder />
        <div className={`${styles.successIcon} mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full`}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16L13 23L26 9" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mb-2.5 font-['Syne'] text-[26px] font-extrabold tracking-tight text-[#f5f0ff]">You're all set!</h2>
        <p className="mb-8 text-sm font-light text-purple-200/50">Your account has been created. Welcome to PrepIQ.</p>
        <a href="/login"
          className={`${styles.btnPrimary} block rounded-[11px] py-3.5 text-center font-['Syne'] text-[15px] font-bold tracking-wide text-white no-underline`}>
          Go to Sign In
        </a>
      </div>
    </div>
  );

  return (
    <div className={`${styles.page} relative flex min-h-screen items-center justify-center bg-[#050508] px-4 py-6`}>
      <div className={`${styles.card} relative z-10 w-full max-w-[460px] overflow-hidden rounded-[20px] p-8 sm:p-11`}>
        <div className={styles.cornerGlow} />
        <WaveBorder />

        {/* Brand */}
        <div className={`${styles.fadeUp} mb-7 flex items-center gap-2.5`}>
          <div className={`${styles.brandIcon} flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] text-lg`}>
            ⚡
          </div>
          <span className={`${styles.brandName} text-[18px] font-bold text-[#f0eaff]`}>
            Prep<span className="text-violet-400">IQ</span>
          </span>
        </div>

        <StepIndicator step={step} />

        {/* ── Step 1 ── */}
        {step === "info" && (
          <div key={`info-${animKey}`} className={styles.stepContent}>
            <h1 className="mb-1.5 font-['Syne'] text-[26px] font-extrabold leading-tight tracking-tight text-[#f5f0ff] sm:text-[28px]">
              Create account
            </h1>
            <p className="mb-7 text-sm font-light text-purple-200/50">Start your interview prep journey</p>

            {/* ↓ fieldsStack gives consistent vertical gap between fields */}
            <div className={styles.fieldsStack}>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.fieldLabel}>
                  Full name
                </label>
                <SparkleInput id="name" type="text" placeholder="Ada Lovelace" value={name}
                  onChange={(v) => { setName(v); if (err1.name) setErr1((e) => ({ ...e, name: validateName(v) })); }}
                  error={err1.name} />
              </div>
              <div className={styles.field}>
                <label htmlFor="email-su" className={styles.fieldLabel}>
                  Email address
                </label>
                <SparkleInput id="email-su" type="email" placeholder="you@example.com" value={email}
                  onChange={(v) => { setEmail(v); if (err1.email) setErr1((e) => ({ ...e, email: validateEmail(v) })); }}
                  error={err1.email} />
              </div>
            </div>

            <button onClick={handleInfo} disabled={loading}
              className={`${styles.btnPrimary} mt-7 w-full cursor-pointer rounded-[11px] border-0 py-3.5 font-['Syne'] text-[15px] font-bold tracking-wide text-white`}>
              {loading && <span className={styles.spinner} />}
              {loading ? "Sending OTP…" : "Continue →"}
            </button>

            <p className="mt-6 text-center text-[13px] text-purple-200/40">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-violet-400 no-underline transition-colors hover:text-violet-300">Sign in</a>
            </p>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === "otp" && (
          <div key={`otp-${animKey}`} className={styles.stepContent}>
            <h1 className="mb-1.5 font-['Syne'] text-[26px] font-extrabold leading-tight tracking-tight text-[#f5f0ff] sm:text-[28px]">
              Check your email
            </h1>
            <p className="mb-7 text-sm font-light text-purple-200/50">
              We sent a 6-digit code to{" "}
              <strong className="font-medium text-violet-400">{email}</strong>
            </p>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                Verification code
              </label>
              <OtpInput value={otp} onChange={(v) => { setOtp(v); if (otpErr) setOtpErr(""); }} />
              {otpErr && (
                <p className="mt-2 flex items-center gap-1 text-[12px] text-red-400">
                  <span className="text-[10px]">⚠</span> {otpErr}
                </p>
              )}
            </div>

            <button onClick={handleOtp} disabled={loading}
              className={`${styles.btnPrimary} mt-7 w-full cursor-pointer rounded-[11px] border-0 py-3.5 font-['Syne'] text-[15px] font-bold tracking-wide text-white`}>
              {loading && <span className={styles.spinner} />}
              {loading ? "Verifying…" : "Verify Code →"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[13px]">
              <span className="text-purple-200/40">Didn't receive it?</span>
              {canResend ? (
                <button onClick={handleResend}
                  className="cursor-pointer border-0 bg-transparent p-0 font-medium text-violet-400 transition-colors hover:text-violet-300">
                  Resend code
                </button>
              ) : (
                <span className="tabular-nums text-violet-400/45">Resend in {timer}s</span>
              )}
            </div>

            <button
              onClick={() => { goTo("info"); setOtp(Array(6).fill("")); setOtpErr(""); }}
              className="mt-3 w-full cursor-pointer border-0 bg-transparent py-2 text-center text-[13px] text-violet-400/50 transition-colors hover:text-violet-400">
              ← Change email
            </button>
          </div>
        )}

        {/* ── Step 3 ── */}
        {step === "password" && (
          <div key={`pass-${animKey}`} className={styles.stepContent}>
            <h1 className="mb-1.5 font-['Syne'] text-[26px] font-extrabold leading-tight tracking-tight text-[#f5f0ff] sm:text-[28px]">
              Set your password
            </h1>
            <p className="mb-7 text-sm font-light text-purple-200/50">Choose a strong password to secure your account</p>

            <div className={styles.fieldsStack}>
              <div className={styles.field}>
                <label htmlFor="password-su" className={styles.fieldLabel}>
                  Password
                </label>
                <div className="relative">
                  <SparkleInput id="password-su" type={showPass ? "text" : "password"} placeholder="••••••••••"
                    value={password}
                    onChange={(v) => { setPassword(v); if (err3.password) setErr3((e) => ({ ...e, password: validatePass(v) })); }}
                    error={err3.password} />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-[14px] z-10 flex cursor-pointer items-center border-0 bg-transparent p-1 text-violet-400/50 transition-colors hover:text-violet-400">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div className={styles.field}>
                <label htmlFor="confirm-su" className={styles.fieldLabel}>
                  Confirm password
                </label>
                <div className="relative">
                  <SparkleInput id="confirm-su" type={showConf ? "text" : "password"} placeholder="••••••••••"
                    value={confirm}
                    onChange={(v) => { setConfirm(v); if (err3.confirm) setErr3((e) => ({ ...e, confirm: validateConf(password, v) })); }}
                    error={err3.confirm} />
                  <button type="button" tabIndex={-1} onClick={() => setShowConf((v) => !v)}
                    className="absolute right-3.5 top-[14px] z-10 flex cursor-pointer items-center border-0 bg-transparent p-1 text-violet-400/50 transition-colors hover:text-violet-400">
                    <EyeIcon open={showConf} />
                  </button>
                </div>
              </div>
            </div>

            <button onClick={handlePassword} disabled={loading}
              className={`${styles.btnPrimary} mt-7 w-full cursor-pointer rounded-[11px] border-0 py-3.5 font-['Syne'] text-[15px] font-bold tracking-wide text-white`}>
              {loading && <span className={styles.spinner} />}
              {loading ? "Creating account…" : "Create Account 🎉"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}