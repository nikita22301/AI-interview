"use client";

import { useRef } from "react";
import styles from "./style/Otpstep.module.css"

interface Props {
  email: string;
  otp: string[];
  setOtp: (v: string[]) => void;
  otpErr: string;
  setOtpErr: (v: string) => void;
  timer: number;
  canResend: boolean;
  loading: boolean;
  onSubmit: () => void;
  onResend: () => void;
  onBack: () => void;
}

function OtpInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...value]; next[i] = digit; onChange(next);
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
    <div className={styles.otpGrid}>
      {Array.from({ length: 6 }, (_, i) => (
        <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste} autoComplete="one-time-code"
          className={[styles.otpBox, value[i] ? styles.otpFilled : ""].join(" ")} />
      ))}
    </div>
  );
}

export default function OtpStep({ email, otp, setOtp, otpErr, setOtpErr, timer, canResend, loading, onSubmit, onResend, onBack }: Props) {
  return (
    <div className={styles.stepContent}>
      <h1 className={styles.heading}>Check your email</h1>
      <p className={styles.subheading}>
        We sent a 6-digit code to <strong className={styles.emailHighlight}>{email}</strong>
      </p>

      <div className={styles.field}>
        <label className={styles.label}>Verification code</label>
        <OtpInput value={otp} onChange={(v) => { setOtp(v); if (otpErr) setOtpErr(""); }} />
        {otpErr && <p className={styles.errorMsg}><span>⚠</span> {otpErr}</p>}
      </div>

      <button onClick={onSubmit} disabled={loading} className={styles.btn}>
        {loading && <span className={styles.spinner} />}
        {loading ? "Verifying…" : "Verify Code →"}
      </button>

      <div className={styles.resendRow}>
          <span className={styles.resendText}>Didn't receive it?</span>
          {canResend
            ? <button onClick={onResend} className={styles.resendBtn}>Resend OTP</button>
            : <span className={styles.timer}>Resend in {timer}s</span>}
      
      </div>
      <div style={{textAlign:"center"}}>

       {canResend && (
  <p className={styles.expiredMsg} style={{textAlign:"center"}}>
    ⚠️ OTP expired. Please resend.
  </p>
)}
      </div>

      <button onClick={onBack} className={styles.backBtn}>← Change email</button>
    </div>
  );
}