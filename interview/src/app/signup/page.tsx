"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Signuppage.module.css";
import { Step, validatePass, validateConf } from "../utils/singup"
import NameEmailStep from "../components/Singup/Nameemailstep";
import OtpStep from "../components/Singup/Otpstep";
import PasswordStep from "../components/Singup/Passwordstep";

// ─── Step Indicator ───────────────────────────────────────────
function StepIndicator({ step }: { step: Step }) {
  const steps: Step[] = ["info", "otp", "password"];
  const idx = steps.indexOf(step);
  const labels = ["Your info", "Verify email", "Set password"];

  return (
    <div className={styles.stepIndicator}>
      {steps.map((s, i) => (
        <div key={s} className={styles.stepItem}>
          <div className={[styles.stepDot, i < idx ? styles.stepDotDone : i === idx ? styles.stepDotActive : ""].join(" ")}>
            {i < idx ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : <span>{i + 1}</span>}
          </div>
          <span className={[styles.stepLabel, i === idx ? styles.stepLabelActive : ""].join(" ")}>
            {labels[i]}
          </span>
          {i < 2 && <div className={[styles.stepLine, i < idx ? styles.stepLineDone : ""].join(" ")} />}
        </div>
      ))}
    </div>
  );
}

// ─── Wave Border ──────────────────────────────────────────────
function WaveBorder() {
  const dots = [
    { cx: 220, cy: 18, r: 2.5 }, { cx: 170, cy: 55, r: 2 },
    { cx: 148, cy: 105, r: 2.8 }, { cx: 108, cy: 155, r: 1.8 }, { cx: 55, cy: 188, r: 2.2 },
  ];
  return (
    <svg className={styles.waveBorder} viewBox="0 0 240 240" fill="none">
      <defs>
        <linearGradient id="waveGrad" x1="240" y1="0" x2="80" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#7c3aed" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5b21b6" stopOpacity="0" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d="M240 0 C200 0, 160 10, 140 40 C120 70, 150 100, 120 130 C90 160, 40 155, 20 190 C10 207, 5 225, 0 240"
        stroke="url(#waveGrad)" strokeWidth="1.5" fill="none" filter="url(#glow)" strokeLinecap="round" />
      <path d="M240 0 C210 5, 175 20, 160 50 C145 80, 170 108, 148 138 C126 168, 75 162, 52 196 C38 215, 20 230, 0 240"
        stroke="url(#waveGrad)" strokeWidth="0.8" fill="none" opacity="0.5" strokeLinecap="round" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#c4b5fd" className={styles.waveDot}
          style={{ animationDelay: `${i * 0.25}s`, animationDuration: `${1.5 + i * 0.4}s` }} />
      ))}
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function SignupPage() {
  const [step, setStep]       = useState<Step>("info");
  const [animKey, setAnimKey] = useState(0);

  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [err1, setErr1]   = useState({ name: "", email: "" });

  const [otp, setOtp]             = useState<string[]>(Array(6).fill(""));
  const [otpErr, setOtpErr]       = useState("");
  const [timer, setTimer]         = useState(30);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [err3, setErr3]         = useState({ password: "", confirm: "" });

  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  useEffect(() => {
    if (step !== "otp") return;
    setTimer(30); setCanResend(false);
    timerRef.current = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(timerRef.current!); setCanResend(true); return 0; } return t - 1; });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const goTo = (s: Step) => { setStep(s); setAnimKey((k) => k + 1); };

  const handleInfo = () => {
    // validation lives in NameEmailStep — it calls setErr1 and returns early if invalid
    setLoading(true);
    setTimeout(() => { setLoading(false); goTo("otp"); }, 1200);
  };

  const handleOtp = () => {
    if (otp.join("").length < 6) { setOtpErr("Enter all 6 digits"); return; }
    setOtpErr(""); setLoading(true);
    setTimeout(() => { setLoading(false); goTo("password"); }, 1200);
  };

  const handleResend = () => {
    setOtp(Array(6).fill("")); setOtpErr(""); setCanResend(false); setTimer(30);
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

  if (done) return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.successCard}`}>
        <div className={styles.cornerGlow} /><WaveBorder />
        <div className={styles.successIcon}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16L13 23L26 9" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className={styles.successHeading}>You're all set!</h2>
        <p className={styles.successSub}>Your account has been created. Welcome to PrepIQ.</p>
        <a href="/" className={styles.successBtn}>Go to Sign In</a>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cornerGlow} /><WaveBorder />

        <div className={styles.brand}>
          <div className={styles.brandIcon}>⚡</div>
          <span className={styles.brandName}>Prep<span className={styles.brandAccent}>IQ</span></span>
        </div>

        <StepIndicator step={step} />

        {step === "info" && (
          <NameEmailStep key={`info-${animKey}`}
            name={name} setName={setName} email={email} setEmail={setEmail}
            err={err1} setErr={setErr1} loading={loading} onSubmit={handleInfo} />
        )}
        {step === "otp" && (
          <OtpStep key={`otp-${animKey}`}
            email={email} otp={otp} setOtp={setOtp} otpErr={otpErr} setOtpErr={setOtpErr}
            timer={timer} canResend={canResend} loading={loading}
            onSubmit={handleOtp} onResend={handleResend}
            onBack={() => { goTo("info"); setOtp(Array(6).fill("")); setOtpErr(""); }} />
        )}
        {step === "password" && (
          <PasswordStep key={`pass-${animKey}`}
            password={password} setPassword={setPassword} confirm={confirm} setConfirm={setConfirm}
            err={err3} setErr={setErr3} loading={loading} onSubmit={handlePassword} />
        )}
      </div>
    </div>
  );
}