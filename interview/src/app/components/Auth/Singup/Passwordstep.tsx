"use client";

import { useState, useRef } from "react";
import styles from "./style/Passwordstep.module.css"
import { useSparkles, validatePass, validateConf } from "../../../utils/singup"
import { AuthMode } from "../../../utils/singup";
interface Props {
  password: string; setPassword: (v: string) => void;
  confirm: string; setConfirm: (v: string) => void;
  err: { password: string; confirm: string };
  setErr: (e: { password: string; confirm: string }) => void;
  loading: boolean;
  onSubmit: () => void;
  mode: AuthMode
}

function SparkleInput({ type, placeholder, value, onChange, id, error }: {
  type: string; placeholder: string; value: string;
  onChange: (v: string) => void; id: string; error?: string;
}) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useSparkles(active, containerRef);

  return (
    <div>
      <div ref={containerRef} className={styles.sparkleWrapper}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => { if (document.activeElement?.id !== id) setActive(false); }}>
        {sparkles.map((s) => (
          <span key={s.id} className={styles.sparkleDot}
            style={{ left: s.x, top: s.y, width: s.size, height: s.size, opacity: s.opacity }} />
        ))}
        <input id={id} type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setActive(true)} onBlur={() => setActive(false)}
          autoComplete="off"
          className={[styles.input, active ? styles.inputActive : "", error ? styles.inputError : ""].join(" ")} />
      </div>
      {error && <p className={styles.errorMsg}><span>⚠</span> {error}</p>}
    </div>
  );
}

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
    <div className={styles.strengthWrap}>
      <div className={styles.strengthBar}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={styles.strengthSeg} style={{ background: i < score ? color : "rgba(255,255,255,0.08)" }} />
        ))}
        <span className={styles.strengthLabel} style={{ color }}>{label}</span>
      </div>
      <div className={styles.checks}>
        {checks.map((c) => (
          <span key={c.label} className={c.ok ? styles.checkOk : styles.checkNo}>
            {c.ok ? "✓" : "·"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PasswordStep({ password, setPassword, confirm, setConfirm, err, setErr, loading, onSubmit, mode }: Props) {
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  return (
    <div className={styles.stepContent}>
      <h1 className={styles.heading}>Set your password</h1>
      <p className={styles.subheading}>Choose a strong password to secure your account</p>

      <div className={styles.fieldsStack}>
        <div className={styles.field}>
          <label htmlFor="password-su" className={styles.label}>Password</label>
          <div className={styles.inputWrap}>
            <SparkleInput id="password-su" type={showPass ? "text" : "password"} placeholder="••••••••••"
              value={password}
              onChange={(v) => { setPassword(v); if (err.password) setErr({ ...err, password: validatePass(v) }); }}
              error={err.password} />
            <button type="button" tabIndex={-1} onClick={() => setShowPass((v) => !v)} className={styles.eyeBtn}>
              <EyeIcon open={showPass} />
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirm-su" className={styles.label}>Confirm password</label>
          <div className={styles.inputWrap}>
            <SparkleInput id="confirm-su" type={showConf ? "text" : "password"} placeholder="••••••••••"
              value={confirm}
              onChange={(v) => { setConfirm(v); if (err.confirm) setErr({ ...err, confirm: validateConf(password, v) }); }}
              error={err.confirm} />
            <button type="button" tabIndex={-1} onClick={() => setShowConf((v) => !v)} className={styles.eyeBtn}>
              <EyeIcon open={showConf} />
            </button>
          </div>
        </div>
      </div>
       {mode === "signup"?
        <button onClick={onSubmit} disabled={loading} className={styles.btn}>
          {loading && <span className={styles.spinner} />}
          {loading ? "Creating account…" : "Create Account 🎉"}
        </button> :
        <button onClick={onSubmit} disabled={loading} className={styles.btn}>
          {loading && <span className={styles.spinner} />}
          {loading ? "Setting password…" : "Set Password 🎉"}
        </button>}
    </div>
  );
}