"use client";

import styles from "./style/Nameemailstep.module.css";
import { validateName, validateEmail } from "../../../utils/validation";
import { AuthMode } from "../../../utils/signup";
import SparkleInput from "../../CommonUI/SparkleInput";
import Link from "next/link";

interface Props {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  err: { name: string; email: string };
  setErr: (e: { name: string; email: string }) => void;
  loading: boolean;
  onSubmit: () => void;
  mode: AuthMode;
}

export default function NameEmailStep({
  name,
  setName,
  email,
  setEmail,
  err,
  setErr,
  loading,
  onSubmit,
  mode,
}: Props) {
  return (
    <div className={styles.stepContent}>
      <h1 className={styles.heading}>
        {mode === "signup" ? "Create Account" : "Reset Password"}
      </h1>
      <p className={styles.subheading}>Start your interview prep journey</p>

      <div className={styles.fieldsStack}>
        {mode === "signup" && (
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Full name
            </label>
            <SparkleInput
              id="name"
              type="text"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(v) => {
                setName(v);
                if (err.name) setErr({ ...err, name: validateName(v) });
              }}
              error={err.name}
            />
          </div>
        )}
        <div className={styles.field}>
          <label htmlFor="email-su" className={styles.label}>
            Email address
          </label>
          <SparkleInput
            id="email-su"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (err.email) setErr({ ...err, email: validateEmail(v) });
            }}
            error={err.email}
          />
        </div>
      </div>

      <button onClick={onSubmit} disabled={loading} className={styles.btn}>
        {loading && <span className={styles.spinner} />}
        {loading ? "Sending OTP…" : "Continue →"}
      </button>
      
      {mode === "signup" ? (
        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/" className={styles.link}>
            Sign in
          </Link>
        </p>
      ) : (
        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className={styles.link}>
            Create one free
          </Link>
        </p>
      )}
    </div>
  );
}
