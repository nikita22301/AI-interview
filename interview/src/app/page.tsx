"use client";

import { useState } from "react";
import styles from "../../public/loginpage.module.css";
import { useRouter } from "next/navigation";
import { loginUser } from "../app/api/login";
import Link from "next/link";
import {
  hasErrors,
  validateLoginForm,
  validateEmail,
} from "./utils/validation";
import AuthLayout from "./components/CommonUI/AuthLayout";
import SparkleInput from "./components/CommonUI/SparkleInput";
import GoogleIcon from "./components/CommonUI/GoogleIcon";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

      router.push("/OnBoarding");
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      alert(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout cardClassName="w-full max-w-[440px] px-11 py-12 mx-4">
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
          <label htmlFor="email" className={styles.fieldLabel}>
            Email
          </label>
          <SparkleInput
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(v) => {
              setEmail(v);
              // Clear error live once user starts fixing it
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: validateEmail(v) }));
              }
            }}
            onBlur={(v) => {
              // Validate when user leaves the field
              setErrors((prev) => ({ ...prev, email: validateEmail(v) }));
            }}
            error={errors.email}
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.fieldLabel}>
            Password
          </label>
          <SparkleInput
            id="password"
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(v) => {
              setPassword(v);
              // Clear error once they start typing
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: v ? "" : "Password is required" }));
              }
            }}
            onBlur={(v) => {
              setErrors((prev) => ({ ...prev, password: v ? "" : "Password is required" }));
            }}
            error={errors.password}
          />
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
        type="button"
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
    </AuthLayout>
  );
}