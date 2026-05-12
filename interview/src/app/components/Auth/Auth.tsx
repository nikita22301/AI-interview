// app/auth/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { AuthCard } from "../CommonUI/FormDesign/Authcard"
import { SparkleInput } from "../CommonUI/FormDesign/SparkleInput";
import { PrimaryButton, BackButton } from "../../components/CommonUI/FormDesign/Buttons";
import Logo from "../CommonUI/logo";

type Step = "info" | "otp" | "password";
type AuthMode = "signup" | "forgot-password";

interface AuthPageProps {
  mode: AuthMode;
}

function StepIndicator({ step, mode }: { step: Step; mode: AuthMode }) {
  const steps: Step[] = ["info", "otp", "password"];
  const idx = steps.indexOf(step);
  const labels = mode === "signup" ? ["Your info", "Verify email", "Set password"] : ["Your email", "Verify OTP", "Reset password"];

  return (
    <div className="step-indicator">
      {steps.map((s, i) => (
        <div key={s} className="step-item">
          <div className={`step-dot ${i < idx ? "step-dot-done" : i === idx ? "step-dot-active" : ""}`}>
            {i < idx ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg> : <span>{i + 1}</span>}
          </div>
          <span className={`step-label ${i === idx ? "step-label-active" : ""}`}>{labels[i]}</span>
          {i < 2 && <div className={`step-line ${i < idx ? "step-line-done" : ""}`} />}
        </div>
      ))}
    </div>
  );
}

function NameEmailStep({ name, setName, email, setEmail, err, setErr, loading, onSubmit, mode }: any) {
  const validate = () => {
    let hasError = false;
    const newErr = { name: "", email: "" };
    if (mode === "signup" && !name.trim()) {
      newErr.name = "Name is required";
      hasError = true;
    }
    if (!email.trim()) {
      newErr.email = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErr.email = "Invalid email address";
      hasError = true;
    }
    setErr(newErr);
    return !hasError;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  return (
    <div className="step-in">
      {mode === "signup" && (
        <div className="mb-4">
          <label htmlFor="name" className="field-label">Full name</label>
          <SparkleInput id="name" placeholder="Alex Johnson" value={name} onChange={setName} />
          {err.name && <p className="text-red-400 text-xs mt-1">{err.name}</p>}
        </div>
      )}
      <div className="mb-7">
        <label htmlFor="email" className="field-label">Email address</label>
        <SparkleInput id="email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
        {err.email && <p className="text-red-400 text-xs mt-1">{err.email}</p>}
      </div>
      <PrimaryButton onClick={handleSubmit} loading={loading}>
        {mode === "signup" ? "Create account →" : "Send code →"}
      </PrimaryButton>
    </div>
  );
}

function OtpStep({ email, otp, setOtp, otpErr, setOtpErr, timer, canResend, loading, onSubmit, onResend, onBack }: any) {
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    setOtpErr("");
  };

  return (
    <div className="step-in">
      <p className="text-sm text-purple-200/50 mb-6">
        We sent a 6-digit code to <span className="text-purple-300">{email}</span>
      </p>

      <div className="flex justify-between gap-2 mb-6">
        {otp.map((digit: string, idx: number) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="input w-12 h-12 text-center text-xl rounded-[10px]"
          />
        ))}
      </div>

      {otpErr && <p className="text-red-400 text-xs text-center mb-4">{otpErr}</p>}

      <div className="flex justify-between items-center mb-7">
        <button onClick={onBack} type="button" className="text-purple-400/60 text-sm hover:text-purple-400 transition-colors">
          ← Change email
        </button>
        {canResend ? (
          <button onClick={onResend} type="button" className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
            Resend code
          </button>
        ) : (
          <span className="text-purple-200/30 text-sm">Resend in {timer}s</span>
        )}
      </div>

      <PrimaryButton onClick={onSubmit} loading={loading}>Verify →</PrimaryButton>
    </div>
  );
}

function PasswordStep({ password, setPassword, confirm, setConfirm, err, setErr, loading, onSubmit, mode }: any) {
  const validate = () => {
    let hasError = false;
    const newErr = { password: "", confirm: "" };
    if (password.length < 8) {
      newErr.password = "Password must be at least 8 characters";
      hasError = true;
    }
    if (password !== confirm) {
      newErr.confirm = "Passwords do not match";
      hasError = true;
    }
    setErr(newErr);
    return !hasError;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  return (
    <div className="step-in">
      <div className="mb-4">
        <label htmlFor="password" className="field-label">
          {mode === "signup" ? "Create password" : "New password"}
        </label>
        <SparkleInput id="password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
        {err.password && <p className="text-red-400 text-xs mt-1">{err.password}</p>}
      </div>
      <div className="mb-7">
        <label htmlFor="confirm" className="field-label">Confirm password</label>
        <SparkleInput id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={setConfirm} />
        {err.confirm && <p className="text-red-400 text-xs mt-1">{err.confirm}</p>}
      </div>
      <PrimaryButton onClick={handleSubmit} loading={loading}>
        {mode === "signup" ? "Complete signup →" : "Reset password →"}
      </PrimaryButton>
    </div>
  );
}

// Main Component
export default function AuthPage({ mode }: AuthPageProps) {
  const [step, setStep] = useState<Step>("info");
  const [animKey, setAnimKey] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err1, setErr1] = useState({ name: "", email: "" });
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpErr, setOtpErr] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err3, setErr3] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step !== "otp") return;
    setTimer(30);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const goTo = (s: Step) => { setStep(s); setAnimKey((k) => k + 1); };

  const handleInfo = () => {
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
    setOtp(Array(6).fill(""));
    setOtpErr("");
    setCanResend(false);
    setTimer(30);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handlePassword = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
  };

  if (done) {
    return (
      <AuthCard maxWidth={420}>
        <div className="success-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16L13 23L26 9" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="success-heading">{mode === "signup" ? "You're all set!" : "Password Updated!"}</h2>
        <p className="success-sub">
          {mode === "signup" ? "Your account has been created. Welcome to PrepIQ." : "Your password has been reset successfully."}
        </p>
        <a href="/login" className="success-btn">Go to Sign In</a>
      </AuthCard>
    );
  }

  return (
    <AuthCard maxWidth={460}>
      <Logo />
      <StepIndicator step={step} mode={mode} />

      {step === "info" && (
        <NameEmailStep
          key={`info-${animKey}`}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          err={err1}
          setErr={setErr1}
          loading={loading}
          onSubmit={handleInfo}
          mode={mode}
        />
      )}
      {step === "otp" && (
        <OtpStep
          key={`otp-${animKey}`}
          email={email}
          otp={otp}
          setOtp={setOtp}
          otpErr={otpErr}
          setOtpErr={setOtpErr}
          timer={timer}
          canResend={canResend}
          loading={loading}
          onSubmit={handleOtp}
          onResend={handleResend}
          onBack={() => { goTo("info"); setOtp(Array(6).fill("")); setOtpErr(""); }}
        />
      )}
      {step === "password" && (
        <PasswordStep
          key={`pass-${animKey}`}
          password={password}
          setPassword={setPassword}
          confirm={confirm}
          setConfirm={setConfirm}
          err={err3}
          setErr={setErr3}
          loading={loading}
          onSubmit={handlePassword}
          mode={mode}
        />
      )}
    </AuthCard>
  );
}