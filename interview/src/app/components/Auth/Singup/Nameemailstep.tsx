"use client";

import { useState, useRef } from "react";
import styles from "./style/Nameemailstep.module.css"
import { useSparkles } from "../../../utils/singup"
import { validateName, validateEmail } from "../../../utils/validation"
import { AuthMode } from "../../../utils/singup";

interface Props {
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  err: { name: string; email: string };
  setErr: (e: { name: string; email: string }) => void;
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

export default function NameEmailStep({ name, setName, email, setEmail, err, setErr, loading, onSubmit, mode }: Props) {
  return (
    <div className={styles.stepContent}>
      <h1 className={styles.heading}>
        {mode === "signup"
          ? "Create Account"
          : "Reset Password"}
      </h1>
      <p className={styles.subheading}>Start your interview prep journey</p>

      <div className={styles.fieldsStack}>
        {mode === "signup" && (
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Full name</label>
            <SparkleInput id="name" type="text" placeholder="Ada Lovelace" value={name}
              onChange={(v) => { setName(v); if (err.name) setErr({ ...err, name: validateName(v) }); }}
              error={err.name} />
          </div>)}
        <div className={styles.field}>
          <label htmlFor="email-su" className={styles.label}>Email address</label>
          <SparkleInput id="email-su" type="email" placeholder="you@example.com" value={email}
            onChange={(v) => { setEmail(v); if (err.email) setErr({ ...err, email: validateEmail(v) }); }}
            error={err.email} />
        </div>
      </div>

      <button onClick={onSubmit} disabled={loading} className={styles.btn}>
        {loading && <span className={styles.spinner} />}
        {loading ? "Sending OTP…" : "Continue →"}
      </button>
      {mode === "signup" ?
        <p className={styles.footer}>
          Already have an account?{" "}
          <a href="/" className={styles.link}>Sign in</a>
        </p> : <p className={styles.footer}>
          Don't have an account?{" "}
          <a href="/" className={styles.link}> Create one free</a>
        </p>}
    </div>
  );
}