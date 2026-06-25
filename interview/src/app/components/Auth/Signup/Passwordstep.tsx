"use client";

import styles from "./style/Passwordstep.module.css";
import { validatePassword, validateConfirmPassword } from "../../../utils/validation";
import { AuthMode } from "../../../utils/signup";
import SparkleInput from "../../CommonUI/SparkleInput";

interface Props {
  password: string;
  setPassword: (v: string) => void;
  confirm: string;
  setConfirm: (v: string) => void;
  err: { password: string; confirm: string };
  setErr: (e: { password: string; confirm: string }) => void;
  loading: boolean;
  onSubmit: () => void;
  mode: AuthMode;
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
          <div
            key={i}
            className={styles.strengthSeg}
            style={{ background: i < score ? color : "rgba(255,255,255,0.08)" }}
          />
        ))}
        <span className={styles.strengthLabel} style={{ color }}>
          {label}
        </span>
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

export default function PasswordStep({
  password,
  setPassword,
  confirm,
  setConfirm,
  err,
  setErr,
  loading,
  onSubmit,
  mode,
}: Props) {
  return (
    <div className={styles.stepContent}>
      <h1 className={styles.heading}>Set your password</h1>
      <p className={styles.subheading}>Choose a strong password to secure your account</p>

      <div className={styles.fieldsStack}>
        <div className={styles.field}>
          <label htmlFor="password-su" className={styles.label}>
            Password
          </label>
          <SparkleInput
            id="password-su"
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(v) => {
              setPassword(v);
              if (err.password) setErr({ ...err, password: validatePassword(v) });
            }}
            onBlur={(v) => {
              setErr({ ...err, password: validatePassword(v) });
            }}
            error={err.password}
            showPasswordToggle={true}
          />
          <PasswordStrength password={password} />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirm-su" className={styles.label}>
            Confirm password
          </label>
          <SparkleInput
            id="confirm-su"
            type="password"
            placeholder="••••••••••"
            value={confirm}
            onChange={(v) => {
              setConfirm(v);
              if (err.confirm) setErr({ ...err, confirm: validateConfirmPassword(password, v) });
            }}
            onBlur={(v) => {
              setErr({ ...err, confirm: validateConfirmPassword(password, v) });
            }}
            error={err.confirm}
            showPasswordToggle={true}
          />
        </div>
      </div>

      {mode === "signup" ? (
        <button onClick={onSubmit} disabled={loading} className={styles.btn}>
          {loading && <span className={styles.spinner} />}
          {loading ? "Creating account…" : "Create Account 🎉"}
        </button>
      ) : (
        <button onClick={onSubmit} disabled={loading} className={styles.btn}>
          {loading && <span className={styles.spinner} />}
          {loading ? "Setting password…" : "Set Password 🎉"}
        </button>
      )}
    </div>
  );
}
