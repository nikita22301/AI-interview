"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Authpage.module.css";
import { Step, AuthMode } from "../../utils/signup";
import NameEmailStep from "./Signup/Nameemailstep";
import OtpStep from "./Signup/Otpstep";
import PasswordStep from "./Signup/Passwordstep";
import AuthLayout from "../CommonUI/AuthLayout";
import { sendOtpApi, verifyOtpApi, signupApi, forgotPassword } from "../../api/signup";
import {
  validateInfoStep,
  validateOtp,
  validatePasswordStep,
  hasErrors,
} from "../../utils/validation";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Step Indicator ───────────────────────────────────────────
function StepIndicator({ step, mode }: { step: Step; mode: AuthMode }) {
  const steps: Step[] = ["info", "otp", "password"];
  const idx = steps.indexOf(step);
  const labels =
    mode === "signup"
      ? ["Your info", "Verify email", "Set password"]
      : ["Your email", "Verify OTP", "Reset password"];

  return (
    <div className={styles.stepIndicator}>
      {steps.map((s, i) => (
        <div key={s} className={styles.stepItem}>
          <div className={[styles.stepDot, i < idx ? styles.stepDotDone : i === idx ? styles.stepDotActive : ""].join(" ")}>
            {i < idx ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
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

// ─── Main Page ────────────────────────────────────────────────
export default function AuthPage({ mode }: { mode: AuthMode }) {
  const router = useRouter();
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
    const frame = requestAnimationFrame(() => {
      setTimer(30);
      setCanResend(false);
    });
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
    return () => {
      cancelAnimationFrame(frame);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const goTo = (s: Step) => {
    setStep(s);
    setAnimKey((k) => k + 1);
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const data = await sendOtpApi(email);
      if (!data.success) {
        alert(data.message);
        return;
      }

      setOtp(Array(6).fill(""));
      setOtpErr("");
      setCanResend(false);
      setTimer(30);

      if (timerRef.current) clearInterval(timerRef.current);
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInfo = async () => {
    const errors = validateInfoStep(name, email, mode);
    setErr1(errors);

    if (hasErrors(errors)) return;

    try {
      setLoading(true);
      const data = await sendOtpApi(email);
      if (!data.success) {
        alert(data.message);
        return;
      }
      goTo("otp");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async () => {
    const error = validateOtp(otp);
    setOtpErr(error);

    if (error) return;

    try {
      setLoading(true);
      const enteredOtp = otp.join("");
      const data = await verifyOtpApi(email, enteredOtp);

      if (!data.success) {
        setOtpErr(data.message);
        return;
      }
      goTo("password");
    } catch (error) {
      console.log(error);
      setOtpErr("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async () => {
    const errors = validatePasswordStep(password, confirm);
    setErr3(errors);
    if (hasErrors(errors)) return;

    try {
      setLoading(true);
      let data;
      if (mode === "signup") {
        data = await signupApi(name, email, password);
      } else {
        data = await forgotPassword(email, password);
      }
      if (!data.success) {
        alert(data.message);
        return;
      }

      if (mode === "signup" && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
      }

      if (mode === "forgot-password") {
        setDone(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setDone(true);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout showLogo={false} cardClassName={styles.successCard}>
        <div className={styles.successIcon}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16L13 23L26 9" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className={styles.successHeading}>
          {mode === "signup" ? "You're all set!" : "Password Updated!"}
        </h2>

        <p className={styles.successSub}>
          {mode === "signup"
            ? "Your account has been created. Welcome to PrepIQ."
            : "Your password has been reset successfully."}
        </p>
        {mode === "signup" ? (
          <button onClick={() => router.push("/onboarding")} className={styles.successBtn}>
            Continue to Onboarding →
          </button>
        ) : (
          <Link href="/" className={styles.successBtn}>
            Go to Sign In
          </Link>
        )}
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showLogo={true}>
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
          onBack={() => {
            goTo("info");
            setOtp(Array(6).fill(""));
            setOtpErr("");
          }}
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
    </AuthLayout>
  );
}