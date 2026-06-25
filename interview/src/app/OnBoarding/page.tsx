"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./onBoarding.module.css";
import Logo from "../components/CommonUI/logo";
import { onBoardingApi } from "../api/onboarding";
import SparkleInput, { useSparkles } from "../components/CommonUI/SparkleInput";
import WaveBorder from "../components/CommonUI/WaveBorder";

// ─── Constants ────────────────────────────────────────────────
const DOMAINS = [
  "Frontend",
  "Backend",
  "Full-Stack",
  "Data / ML",
  "DevOps / Platform",
  "Mobile",
  "Product Management",
  "Design",
  "QA / SDET",
  "Other",
];

const EXPERIENCE_LEVELS = [
  "Student / Intern",
  "0–1 years",
  "1–3 years",
  "3–5 years",
  "5–8 years",
  "8+ years",
];

const SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "React",
  "Node.js",
  "System Design",
  "SQL",
  "Java",
  "Go",
  "C++",
  "AWS",
  "DSA",
  "Behavioral",
  "Leadership",
  "Product Sense",
  "ML / AI",
];

const INTERVIEW_TYPES = [
  "FAANG / Big Tech",
  "Startup",
  "Mid-size company",
  "Remote role",
  "Promotion prep",
  "Just sharpening skills",
];

const PREP_TIMELINES = [
  "< 1 week",
  "1–2 weeks",
  "1 month",
  "2–3 months",
  "No deadline",
];

const TOTAL_STEPS = 4;

// ─── Types ────────────────────────────────────────────────────
interface OnboardingData {
  // Step 1 — Basic
  name: string;
  location: string;
  company: string;
  portfolioUrl: string;
  // Step 2 — Role
  targetRole: string;
  experience: string;
  domain: string;
  dreamCompanies: string;
  // Step 3 — Skills
  skills: string[];
  customSkills: string;
  // Step 4 — Goals
  interviewTypes: string[];
  prepTimeline: string;
  extraContext: string;
}

// ─── Sparkle Textarea ─────────────────────────────────────────
function SparkleTextarea({
  placeholder,
  value,
  onChange,
  id,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkles = useSparkles(active, containerRef);

  return (
    <div
      ref={containerRef}
      className={styles.sparkleWrapper}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        if (document.activeElement?.id !== id) setActive(false);
      }}
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          className={styles.sparkleDot}
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        rows={3}
        className={[
          styles.textarea,
          "rounded-[10px] px-4 py-[13px] text-sm resize-none",
          active ? styles.inputActive : "",
        ].join(" ")}
      />
    </div>
  );
}


// ─── Pill Toggle ──────────────────────────────────────────────
function PillGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}) {
  return (
    <div className={styles.pillsGrid}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={[styles.pill, selected.includes(opt) ? styles.pillActive : ""].join(" ")}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Step 1: Basic Info ───────────────────────────────────────
function StepBasic({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  return (
    <div className={styles.stepIn}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="ob-exp" className={styles.fieldLabel}>
            Experience
          </label>
          <select
            id="ob-exp"
            value={data.experience}
            onChange={(e) => onChange({ experience: e.target.value })}
            className={`${styles.select} rounded-[10px] px-4 py-[13px] text-sm cursor-pointer`}
          >
            <option value="">Select…</option>
            {EXPERIENCE_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ob-location" className={styles.fieldLabel}>
            Location
          </label>
          <SparkleInput
            id="ob-location"
            placeholder="San Francisco, CA"
            value={data.location}
            onChange={(v) => onChange({ location: v })}
          />
        </div>
      </div>
      {data.experience !== "Student / Intern" && (
        <div className="mb-4">
          <label htmlFor="ob-company" className={styles.fieldLabel}>
            Current company
          </label>
          <SparkleInput
            id="ob-company"
            placeholder="Google, Startup, Freelance…"
            value={data.company}
            onChange={(v) => onChange({ company: v })}
          />
        </div>)}

      <div className="mb-7">
        <label htmlFor="ob-portfolio" className={styles.fieldLabel}>
          LinkedIn or portfolio URL
          <span className={styles.fieldLabelOptional}>(optional)</span>
        </label>
        <SparkleInput
          id="ob-portfolio"
          placeholder="https://linkedin.com/in/you"
          value={data.portfolioUrl}
          onChange={(v) => onChange({ portfolioUrl: v })}
        />
      </div>

      <button
        onClick={onNext}
        className={`${styles.btnPrimary} w-full cursor-pointer rounded-[11px] border-0 py-3.5 font-['Syne'] text-[15px] font-bold tracking-wide text-white`}
      >
        Continue →
      </button>
    </div>
  );
}

// ─── Step 2: Role & Experience ────────────────────────────────
function StepRole({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className={styles.stepIn}>
      <div className="mb-4">
        <label htmlFor="ob-role" className={styles.fieldLabel}>
          Target / current role
        </label>
        <SparkleInput
          id="ob-role"
          placeholder="e.g. Senior Software Engineer"
          value={data.targetRole}
          onChange={(v) => onChange({ targetRole: v })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">

        <div>
          <label htmlFor="ob-domain" className={styles.fieldLabel}>
            Domain
          </label>
          <select
            id="ob-domain"
            value={data.domain}
            onChange={(e) => onChange({ domain: e.target.value })}
            className={`${styles.select} rounded-[10px] px-4 py-[13px] text-sm cursor-pointer`}
          >
            <option value="">Select…</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-7">
        <label htmlFor="ob-dream" className={styles.fieldLabel}>
          Dream companies
          <span className={styles.fieldLabelOptional}>(optional)</span>
        </label>
        <SparkleInput
          id="ob-dream"
          placeholder="e.g. Meta, Stripe, any Series B startup"
          value={data.dreamCompanies}
          onChange={(v) => onChange({ dreamCompanies: v })}
        />
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={onBack}
          className={`${styles.btnBack} flex-1 cursor-pointer rounded-[11px] border py-3.5 text-sm font-medium`}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className={`${styles.btnPrimary} flex-[2] cursor-pointer rounded-[11px] border-0 py-3.5 font-['Syne'] text-[15px] font-bold tracking-wide text-white`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Skills ───────────────────────────────────────────
function StepSkills({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const toggleSkill = useCallback(
    (skill: string) => {
      const next = data.skills.includes(skill)
        ? data.skills.filter((s) => s !== skill)
        : [...data.skills, skill];
      onChange({ skills: next });
    },
    [data.skills, onChange]
  );

  return (
    <div className={styles.stepIn}>
      <div className="mb-4">
        <label className={styles.fieldLabel} style={{ marginBottom: 12 }}>
          Select all that apply
        </label>
        <PillGroup
          options={SKILLS}
          selected={data.skills}
          onToggle={toggleSkill}
        />
      </div>

      <div className="mb-7">
        <label htmlFor="ob-custom-skill" className={styles.fieldLabel}>
          Anything else?
          <span className={styles.fieldLabelOptional}>(optional)</span>
        </label>
        <SparkleInput
          id="ob-custom-skill"
          placeholder="e.g. Rust, Kubernetes, GraphQL"
          value={data.customSkills}
          onChange={(v) => onChange({ customSkills: v })}
        />
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={onBack}
          className={`${styles.btnBack} flex-1 cursor-pointer rounded-[11px] border py-3.5 text-sm font-medium`}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className={`${styles.btnPrimary} flex-[2] cursor-pointer rounded-[11px] border-0 py-3.5 font-['Syne'] text-[15px] font-bold tracking-wide text-white`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Goals ────────────────────────────────────────────
function StepGoals({
  data,
  onChange,
  onSubmit,
  onBack,
  loading,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  const toggleType = useCallback(
    (t: string) => {
      const next = data.interviewTypes.includes(t)
        ? data.interviewTypes.filter((x) => x !== t)
        : [...data.interviewTypes, t];
      onChange({ interviewTypes: next });
    },
    [data.interviewTypes, onChange]
  );

  return (
    <div className={styles.stepIn}>
      <div className="mb-4">
        <label className={styles.fieldLabel} style={{ marginBottom: 12 }}>
          Interview type
        </label>
        <PillGroup
          options={INTERVIEW_TYPES}
          selected={data.interviewTypes}
          onToggle={toggleType}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="ob-timeline" className={styles.fieldLabel}>
          Prep timeline
        </label>
        <select
          id="ob-timeline"
          value={data.prepTimeline}
          onChange={(e) => onChange({ prepTimeline: e.target.value })}
          className={`${styles.select} rounded-[10px] px-4 py-[13px] text-sm cursor-pointer`}
        >
          <option value="">How much time do you have?</option>
          {PREP_TIMELINES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-7">
        <label htmlFor="ob-extra" className={styles.fieldLabel}>
          Anything else we should know?
          <span className={styles.fieldLabelOptional}>(optional)</span>
        </label>
        <SparkleTextarea
          id="ob-extra"
          placeholder="e.g. I struggle with system design, I want to focus on behavioral rounds…"
          value={data.extraContext}
          onChange={(v) => onChange({ extraContext: v })}
        />
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={onBack}
          className={`${styles.btnBack} flex-1 cursor-pointer rounded-[11px] border py-3.5 text-sm font-medium`}
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`${styles.btnPrimary} flex-[2] cursor-pointer rounded-[11px] border-0 py-3.5 font-['Syne'] text-[15px] font-bold tracking-wide text-white`}
        >
          {loading && <span className={styles.spinner} />}
          {loading ? "Setting up…" : "Let's go 🚀"}
        </button>
      </div>
    </div>
  );
}

// ─── Step 5: Success ──────────────────────────────────────────
function StepSuccess({ data }: { data: OnboardingData }) {
  const router = useRouter();
  return (
    <div className={`${styles.stepIn} text-center py-4`}>
      <div className={styles.successIcon}>✦</div>
      <h2 className="font-['Syne'] text-[22px] font-extrabold text-[#f5f0ff] mb-2 leading-tight">
        You&apos;re all set{data.name ? `, ${data.name}` : ""}!
      </h2>
      <p className="text-sm font-light text-purple-200/45 mb-8">
        Your personalized interview prep is ready. Let&apos;s crush those
        interviews.
      </p>

      <div className={`${styles.summaryBox} text-left mb-8`}>
        {data.targetRole && (
          <>
            <p className="text-[11px] uppercase tracking-widest text-purple-200/40 mb-1">
              Role
            </p>
            <p className="text-[15px] text-[#f0eaff] mb-4">
              {data.targetRole}
              {data.experience && ` · ${data.experience}`}
            </p>
          </>
        )}
        {data.skills.length > 0 && (
          <>
            <p className="text-[11px] uppercase tracking-widest text-purple-200/40 mb-1">
              Skills
            </p>
            <p className="text-[14px] text-[#c4b5fd]">
              {data.skills.join(" · ")}
            </p>
          </>
        )}
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className={`${styles.btnPrimary} w-full cursor-pointer rounded-[11px] border-0 py-3.5 font-['Syne'] text-[15px] font-bold tracking-wide text-white`}
      >
        Go to Dashboard →
      </button>
    </div>
  );
}

// ─── Step meta ────────────────────────────────────────────────
const STEP_META = [
  {
    label: "Step 1 of 4",
    title: "Tell us about yourself",
    sub: "Help us personalise your interview prep experience",
  },
  {
    label: "Step 2 of 4",
    title: "Your role & experience",
    sub: "We'll tailor questions to your level and domain",
  },
  {
    label: "Step 3 of 4",
    title: "Your skills",
    sub: "Pick the areas you want to be tested on",
  },
  {
    label: "Step 4 of 4",
    title: "Your goals",
    sub: "What are you preparing for?",
  },
];

// ─── Main Page ────────────────────────────────────────────────
export default function OnboardingPage() {
  const [step, setStep] = useState(0); // 0–3 = form steps, 4 = success
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [data, setData] = useState<OnboardingData>({
    name: "",
    location: "",
    company: "",
    portfolioUrl: "",
    targetRole: "",
    experience: "",
    domain: "",
    dreamCompanies: "",
    skills: [],
    customSkills: "",
    interviewTypes: [],
    prepTimeline: "",
    extraContext: "",
  });

  const patch = useCallback((update: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...update }));
  }, []);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     // TODO: replace with your real API call
  //     // await fetch("/api/user/onboarding", {
  //     //   method: "POST",
  //     //   headers: { "Content-Type": "application/json" },
  //     //   body: JSON.stringify(data),
  //     // });
  //     await new Promise((r) => setTimeout(r, 1200)); // simulated delay
  //     setStep(TOTAL_STEPS); // go to success
  //   } catch (err) {
  //     console.error("Onboarding save failed", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        alert("Session expired. Please login again.");
        router.push("/");
        return;
      }

      const result = await onBoardingApi({
        email,
        ...data,  // saara OnboardingData spread kar do
      });

      if (!result.success) {
        alert(result.message);
        return;
      }

      setStep(TOTAL_STEPS);
    } catch (err) {
      console.error("Onboarding failed", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const progressPct =
    step >= TOTAL_STEPS ? 100 : (step / TOTAL_STEPS) * 100;

  return (
    <div className={styles.page}>
      <div
        className={`${styles.card} w-full max-w-[480px] rounded-[20px] px-11 py-12 mx-4`}
      >
        <div className={styles.cornerGlow} />
        <WaveBorder />

        {/* Brand */}
        <Logo />

        {/* Progress */}
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Step header (shown for steps 0–3) */}
        {step < TOTAL_STEPS && (
          <>
            <span className={`${styles.stepLabel} ${styles.fadeUp1}`}>
              {STEP_META[step].label}
            </span>
            <h1
              className={`${styles.fadeUp2} mb-2 font-['Syne'] text-[26px] font-extrabold leading-tight tracking-tight text-[#f5f0ff]`}
            >
              {STEP_META[step].title}
            </h1>
            <p className={`${styles.fadeUp3} mb-8 text-sm font-light text-purple-200/50`}>
              {STEP_META[step].sub}
            </p>
          </>
        )}

        {/* Steps */}
        {step === 0 && (
          <StepBasic data={data} onChange={patch} onNext={next} />
        )}
        {step === 1 && (
          <StepRole data={data} onChange={patch} onNext={next} onBack={back} />
        )}
        {step === 2 && (
          <StepSkills data={data} onChange={patch} onNext={next} onBack={back} />
        )}
        {step === 3 && (
          <StepGoals
            data={data}
            onChange={patch}
            onSubmit={handleSubmit}
            onBack={back}
            loading={loading}
          />
        )}
        {step === TOTAL_STEPS && <StepSuccess data={data} />}
      </div>
    </div>
  );
}