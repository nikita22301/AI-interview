// ─── validation.ts ───────────────────────────────────────────
// Centralised validation for PrepIQ – covers every field used
// in LoginPage, AuthPage (signup / forgot-password), and OnboardingPage.
// ─────────────────────────────────────────────────────────────

// ── Primitive field validators ────────────────────────────────

export function validateName(value: string): string {
  const v = value.trim();
  if (!v) return "Full name is required";
  if (v.length < 2) return "Name must be at least 2 characters";
  if (v.length > 80) return "Name must be under 80 characters";
  if (!/^[A-Za-z\s'\-\.]+$/.test(v))
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  return "";
}

export function validateEmail(value: string): string {
  const v = value.trim();
  if (!v) return "Email is required";

  // Must have proper TLD: letters only after the last dot, 2–6 chars
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/.test(v))
    return "Enter a valid email address";

  if (v.length > 254) return "Email is too long";
  return "";
}

export function validatePassword(value: string): string {
  if (!value) return "Password is required";

  const errors: string[] = [];
  if (value.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(value)) errors.push("one uppercase letter");
  if (!/[0-9]/.test(value)) errors.push("one number");
  if (!/[^A-Za-z0-9]/.test(value)) errors.push("one special character");

  if (errors.length > 0)
    return `Password needs: ${errors.join(", ")}`;

  return "";
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): string {
  if (!confirm) return "Please confirm your password";
  if (confirm !== password) return "Passwords do not match";
  return "";
}

export function validateUrl(value: string): string {
  if (!value) return ""; // optional field
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol))
      return "URL must start with http:// or https://";
    return "";
  } catch {
    return "Enter a valid URL (e.g. https://linkedin.com/in/you)";
  }
}

export function validateLocation(value: string): string {
  const v = value.trim();
  if (!v) return ""; // optional field
  if (v.length < 2) return "Location must be at least 2 characters";
  if (v.length > 100) return "Location must be under 100 characters";
  return "";
}

export function validateTargetRole(value: string): string {
  const v = value.trim();
  if (!v) return "Target role is required";
  if (v.length < 2) return "Role must be at least 2 characters";
  if (v.length > 100) return "Role must be under 100 characters";
  return "";
}

export function validateExperience(value: string): string {
  if (!value) return "Please select your experience level";
  return "";
}

export function validateDomain(value: string): string {
  if (!value) return "Please select your domain";
  return "";
}

export function validateSkills(skills: string[]): string {
  if (!skills.length) return "Select at least one skill";
  return "";
}

export function validateInterviewTypes(types: string[]): string {
  if (!types.length) return "Select at least one interview type";
  return "";
}

export function validatePrepTimeline(value: string): string {
  if (!value) return "Please select your prep timeline";
  return "";
}

export function validateOtp(digits: string[]): string {
  if (digits.join("").length < 6) return "Enter all 6 digits";
  if (!/^\d{6}$/.test(digits.join(""))) return "OTP must be 6 digits";
  return "";
}

// ── Compound form validators ──────────────────────────────────

/** Login form */
export interface LoginErrors {
  email: string;
  password: string;
}
export function validateLoginForm(
  email: string,
  password: string
): LoginErrors {
  return {
    email: validateEmail(email),
    // For login we only check presence, not strength
    password: password ? "" : "Password is required",
  };
}

/** Signup / Forgot-password — step 1 (name + email) */
export interface InfoErrors {
  name: string;
  email: string;
}
export function validateInfoStep(
  name: string,
  email: string,
  mode: "signup" | "forgot-password"
): InfoErrors {
  return {
    name: mode === "signup" ? validateName(name) : "",
    email: validateEmail(email),
  };
}

/** Password step */
export interface PasswordErrors {
  password: string;
  confirm: string;
}
export function validatePasswordStep(
  password: string,
  confirm: string
): PasswordErrors {
  return {
    password: validatePassword(password),
    confirm: validateConfirmPassword(password, confirm),
  };
}

/** Onboarding step 1 — Basic info */
export interface BasicStepErrors {
  experience: string;
  location: string;
  company: string;
  portfolioUrl: string;
}
export function validateBasicStep(
  experience: string,
  location: string,
  company: string,
  portfolioUrl: string
): BasicStepErrors {
  return {
    experience: validateExperience(experience),
    location: validateLocation(location),
    // company is required only when not Student / Intern
    company:
      experience && experience !== "Student / Intern" && !company.trim()
        ? "Current company is required"
        : "",
    portfolioUrl: validateUrl(portfolioUrl),
  };
}

/** Onboarding step 2 — Role */
export interface RoleStepErrors {
  targetRole: string;
  domain: string;
}
export function validateRoleStep(
  targetRole: string,
  domain: string
): RoleStepErrors {
  return {
    targetRole: validateTargetRole(targetRole),
    domain: validateDomain(domain),
  };
}

/** Onboarding step 3 — Skills */
export interface SkillsStepErrors {
  skills: string;
}
export function validateSkillsStep(skills: string[]): SkillsStepErrors {
  return { skills: validateSkills(skills) };
}

/** Onboarding step 4 — Goals */
export interface GoalsStepErrors {
  interviewTypes: string;
  prepTimeline: string;
}
export function validateGoalsStep(
  interviewTypes: string[],
  prepTimeline: string
): GoalsStepErrors {
  return {
    interviewTypes: validateInterviewTypes(interviewTypes),
    prepTimeline: validatePrepTimeline(prepTimeline),
  };
}

// ── Helper: does an errors object have any non-empty string? ──

// export function hasErrors(errors: Record<string, string>): boolean {
//   return Object.values(errors).some((v) => v !== "");
// }
export function hasErrors<T extends object>(errors: T): boolean {
  return Object.values(errors).some(
    (v) => typeof v === "string" && v !== ""
  );
}
// ── Re-export legacy aliases so existing imports keep working ─
// (utils/signup.ts used validatePass / validateConf)

/** @deprecated use validatePassword */
export const validatePass = validatePassword;

/** @deprecated use validateConfirmPassword */
export const validateConf = validateConfirmPassword;