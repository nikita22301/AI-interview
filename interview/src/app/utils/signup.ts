// ─── Types ────────────────────────────────────────────────────
export interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
}

export type Step = "info" | "otp" | "password";

export type AuthMode =
  | "signup"
  | "forgot-password";
// ─── Validation ───────────────────────────────────────────────
export const validateName  = (v: string) => !v.trim() ? "Name is required" : v.trim().length < 2 ? "At least 2 characters" : "";
export const validateEmail = (v: string) => !v.trim() ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : "";
export const validatePass  = (v: string) => !v ? "Password is required" : v.length < 8 ? "Minimum 8 characters" : !/[A-Z]/.test(v) ? "Add an uppercase letter" : !/[0-9]/.test(v) ? "Add a number" : "";
export const validateConf  = (p: string, c: string) => !c ? "Please confirm your password" : p !== c ? "Passwords don't match" : "";


