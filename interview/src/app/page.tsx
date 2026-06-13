// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "../../utils/components/CommonUI/FormDesign/Authcard";
import { SparkleInput } from "../../utils/components/CommonUI/FormDesign/SparkleInput";
import { PrimaryButton, GoogleButton, OrDivider } from "../../utils/components/CommonUI/FormDesign/Buttons";
import Logo from "../../utils/components/CommonUI/logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with your actual auth API call
      // const response = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login clicked");
  };

  return (
    <AuthCard maxWidth={440}>
      <Logo />

      <h1 className="fade-up-2 mb-2 font-['Syne'] text-[28px] font-extrabold leading-tight tracking-tight text-[#f5f0ff]">
        Welcome back
      </h1>
      <p className="fade-up-3 mb-9 text-sm font-light text-purple-200/50">
        Sign in to continue your interview prep
      </p>

      <div className="fade-up-4 flex flex-col gap-5 mb-3">
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <SparkleInput
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="field-label">Password</label>
          <SparkleInput
            id="password"
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
        </div>
      </div>

      <div className="fade-up-5 mb-7 text-right">
        <Link 
          href="/forgot-password" 
          className="text-[12px] text-violet-400/60 no-underline transition-colors hover:text-violet-400"
        >
          Forgot password?
        </Link>
      </div>

      <PrimaryButton 
        onClick={handleSubmit} 
        loading={loading} 
        loadingText="Signing in…" 
        className="fade-up-6"
      >
        Sign In
      </PrimaryButton>

      <div className="fade-up-7 my-6">
        <OrDivider />
      </div>

      <GoogleButton onClick={handleGoogleLogin} className="fade-up-8" />

      <p className="fade-up-9 mt-7 text-center text-[13px] text-purple-200/40">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-violet-400 no-underline transition-colors hover:text-violet-300">
          Create one free
        </Link>
      </p>
    </AuthCard>
  );
}