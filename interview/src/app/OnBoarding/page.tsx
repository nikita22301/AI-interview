// app/onboarding/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "../../../utils/components/CommonUI/FormDesign/Authcard";
import { SparkleInput} from "../../../utils/components/CommonUI/FormDesign/SparkleInput";
import { SparkleTextarea } from "../../../utils/components/CommonUI/FormDesign/SparkleTextArea";
import { PrimaryButton } from "../../../utils/components/CommonUI/FormDesign/Buttons";
import { BackButton } from "../../../utils/components/CommonUI/FormDesign/Buttons";
import { PillGroup } from "../../../utils/components/CommonUI/FormDesign/PillGroup";
import Logo from "../../../utils/components/CommonUI/logo";

// Constants
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

interface OnboardingData {
  name: string;
  location: string;
  company: string;
  portfolioUrl: string;
  targetRole: string;
  experience: string;
  domain: string;
  dreamCompanies: string;
  skills: string[];
  customSkills: string;
  interviewTypes: string[];
  prepTimeline: string;
  extraContext: string;
}

const STEP_META = [
  { label: "Step 1 of 4", title: "Tell us about yourself", sub: "Help us personalise your interview prep experience" },
  { label: "Step 2 of 4", title: "Your role & experience", sub: "We'll tailor questions to your level and domain" },
  { label: "Step 3 of 4", title: "Your skills", sub: "Pick the areas you want to be tested on" },
  { label: "Step 4 of 4", title: "Your goals", sub: "What are you preparing for?" },
];

// Step Components
function StepBasic({ data, onChange, onNext }: { data: OnboardingData; onChange: (patch: Partial<OnboardingData>) => void; onNext: () => void }) {
  return (
    <div className="step-in">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="ob-name" className="field-label">First name</label>
          <SparkleInput id="ob-name" placeholder="Alex" value={data.name} onChange={(v) => onChange({ name: v })} />
        </div>
        <div>
          <label htmlFor="ob-location" className="field-label">Location</label>
          <SparkleInput id="ob-location" placeholder="San Francisco, CA" value={data.location} onChange={(v) => onChange({ location: v })} />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="ob-company" className="field-label">Current company</label>
        <SparkleInput id="ob-company" placeholder="Google, Startup, Freelance…" value={data.company} onChange={(v) => onChange({ company: v })} />
      </div>

      <div className="mb-7">
        <label htmlFor="ob-portfolio" className="field-label">
          LinkedIn or portfolio URL
          <span className="field-label-optional">(optional)</span>
        </label>
        <SparkleInput id="ob-portfolio" placeholder="https://linkedin.com/in/you" value={data.portfolioUrl} onChange={(v) => onChange({ portfolioUrl: v })} />
      </div>

      <PrimaryButton onClick={onNext}>Continue →</PrimaryButton>
    </div>
  );
}

function StepRole({ data, onChange, onNext, onBack }: { data: OnboardingData; onChange: (patch: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="step-in">
      <div className="mb-4">
        <label htmlFor="ob-role" className="field-label">Target / current role</label>
        <SparkleInput id="ob-role" placeholder="e.g. Senior Software Engineer" value={data.targetRole} onChange={(v) => onChange({ targetRole: v })} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="ob-exp" className="field-label">Experience</label>
          <select
            id="ob-exp"
            value={data.experience}
            onChange={(e) => onChange({ experience: e.target.value })}
            className="select rounded-[10px] px-4 py-[13px] text-sm cursor-pointer w-full"
          >
            <option value="">Select…</option>
            {EXPERIENCE_LEVELS.map((l) => (<option key={l} value={l}>{l}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="ob-domain" className="field-label">Domain</label>
          <select
            id="ob-domain"
            value={data.domain}
            onChange={(e) => onChange({ domain: e.target.value })}
            className="select rounded-[10px] px-4 py-[13px] text-sm cursor-pointer w-full"
          >
            <option value="">Select…</option>
            {DOMAINS.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
      </div>

      <div className="mb-7">
        <label htmlFor="ob-dream" className="field-label">
          Dream companies
          <span className="field-label-optional">(optional)</span>
        </label>
        <SparkleInput id="ob-dream" placeholder="e.g. Meta, Stripe, any Series B startup" value={data.dreamCompanies} onChange={(v) => onChange({ dreamCompanies: v })} />
      </div>

      <div className="flex gap-2.5">
        <BackButton onClick={onBack} className="flex-1" />
        <PrimaryButton onClick={onNext} className="flex-[2]">Continue →</PrimaryButton>
      </div>
    </div>
  );
}

function StepSkills({ data, onChange, onNext, onBack }: { data: OnboardingData; onChange: (patch: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }) {
  const toggleSkill = useCallback((skill: string) => {
    const next = data.skills.includes(skill) ? data.skills.filter((s) => s !== skill) : [...data.skills, skill];
    onChange({ skills: next });
  }, [data.skills, onChange]);

  return (
    <div className="step-in">
      <div className="mb-4">
        <label className="field-label" style={{ marginBottom: 12 }}>Select all that apply</label>
        <PillGroup options={SKILLS} selected={data.skills} onToggle={toggleSkill} />
      </div>

      <div className="mb-7">
        <label htmlFor="ob-custom-skill" className="field-label">
          Anything else?
          <span className="field-label-optional">(optional)</span>
        </label>
        <SparkleInput id="ob-custom-skill" placeholder="e.g. Rust, Kubernetes, GraphQL" value={data.customSkills} onChange={(v) => onChange({ customSkills: v })} />
      </div>

      <div className="flex gap-2.5">
        <BackButton onClick={onBack} className="flex-1" />
        <PrimaryButton onClick={onNext} className="flex-[2]">Continue →</PrimaryButton>
      </div>
    </div>
  );
}

function StepGoals({ data, onChange, onSubmit, onBack, loading }: { data: OnboardingData; onChange: (patch: Partial<OnboardingData>) => void; onSubmit: () => void; onBack: () => void; loading: boolean }) {
  const toggleType = useCallback((t: string) => {
    const next = data.interviewTypes.includes(t) ? data.interviewTypes.filter((x) => x !== t) : [...data.interviewTypes, t];
    onChange({ interviewTypes: next });
  }, [data.interviewTypes, onChange]);

  return (
    <div className="step-in">
      <div className="mb-4">
        <label className="field-label" style={{ marginBottom: 12 }}>Interview type</label>
        <PillGroup options={INTERVIEW_TYPES} selected={data.interviewTypes} onToggle={toggleType} />
      </div>

      <div className="mb-4">
        <label htmlFor="ob-timeline" className="field-label">Prep timeline</label>
        <select
          id="ob-timeline"
          value={data.prepTimeline}
          onChange={(e) => onChange({ prepTimeline: e.target.value })}
          className="select rounded-[10px] px-4 py-[13px] text-sm cursor-pointer w-full"
        >
          <option value="">How much time do you have?</option>
          {PREP_TIMELINES.map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>
      </div>

      <div className="mb-7">
        <label htmlFor="ob-extra" className="field-label">
          Anything else we should know?
          <span className="field-label-optional">(optional)</span>
        </label>
        <SparkleTextarea id="ob-extra" placeholder="e.g. I struggle with system design, I want to focus on behavioral rounds…" value={data.extraContext} onChange={(v) => onChange({ extraContext: v })} />
      </div>

      <div className="flex gap-2.5">
        <BackButton onClick={onBack} className="flex-1" />
        <PrimaryButton onClick={onSubmit} loading={loading} loadingText="Setting up…" className="flex-[2]">
          Let's go 🚀
        </PrimaryButton>
      </div>
    </div>
  );
}

function StepSuccess({ data }: { data: OnboardingData }) {
  const router = useRouter();
  return (
    <div className="step-in text-center py-4">
      <div className="success-icon">✦</div>
      <h2 className="font-['Syne'] text-[22px] font-extrabold text-[#f5f0ff] mb-2 leading-tight">
        You&apos;re all set{data.name ? `, ${data.name}` : ""}!
      </h2>
      <p className="text-sm font-light text-purple-200/45 mb-8">
        Your personalized interview prep is ready. Let&apos;s crush those interviews.
      </p>

      <div className="summary-box text-left mb-8">
        {data.targetRole && (
          <>
            <p className="text-[11px] uppercase tracking-widest text-purple-200/40 mb-1">Role</p>
            <p className="text-[15px] text-[#f0eaff] mb-4">{data.targetRole}{data.experience && ` · ${data.experience}`}</p>
          </>
        )}
        {data.skills.length > 0 && (
          <>
            <p className="text-[11px] uppercase tracking-widest text-purple-200/40 mb-1">Skills</p>
            <p className="text-[14px] text-[#c4b5fd]">{data.skills.join(" · ")}</p>
          </>
        )}
      </div>

      <PrimaryButton onClick={() => router.push("/dashboard")}>Go to Dashboard →</PrimaryButton>
    </div>
  );
}

// Main Component
export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "", location: "", company: "", portfolioUrl: "", targetRole: "", experience: "", domain: "", dreamCompanies: "",
    skills: [], customSkills: "", interviewTypes: [], prepTimeline: "", extraContext: "",
  });

  const patch = useCallback((update: Partial<OnboardingData>) => setData((prev) => ({ ...prev, ...update })), []);
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your API call
      await new Promise((r) => setTimeout(r, 1200));
      setStep(TOTAL_STEPS);
    } catch (err) {
      console.error("Onboarding save failed", err);
    } finally {
      setLoading(false);
    }
  };

  const progressPct = step >= TOTAL_STEPS ? 100 : (step / TOTAL_STEPS) * 100;

  return (
    <AuthCard maxWidth={480}>
      <Logo />

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {step < TOTAL_STEPS && (
        <>
          <span className="step-label fade-up-1">{STEP_META[step].label}</span>
          <h1 className="fade-up-2 mb-2 font-['Syne'] text-[26px] font-extrabold leading-tight tracking-tight text-[#f5f0ff]">
            {STEP_META[step].title}
          </h1>
          <p className="fade-up-3 mb-8 text-sm font-light text-purple-200/50">{STEP_META[step].sub}</p>
        </>
      )}

      {step === 0 && <StepBasic data={data} onChange={patch} onNext={next} />}
      {step === 1 && <StepRole data={data} onChange={patch} onNext={next} onBack={back} />}
      {step === 2 && <StepSkills data={data} onChange={patch} onNext={next} onBack={back} />}
      {step === 3 && <StepGoals data={data} onChange={patch} onSubmit={handleSubmit} onBack={back} loading={loading} />}
      {step === TOTAL_STEPS && <StepSuccess data={data} />}
    </AuthCard>
  );
}