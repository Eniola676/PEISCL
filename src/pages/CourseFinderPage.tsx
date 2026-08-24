import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Compass, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";

const EDUCATION_LEVELS = [
  "No formal education",
  "Secondary school (SSCE)",
  "ND / NCE",
  "HND / Bachelor's degree",
  "Master's degree or higher",
  "Currently a student",
];

const COMPUTER_LITERACY = [
  {
    value: "New to computers",
    description: "I rarely use a computer and want to start from the basics.",
  },
  {
    value: "Basic user",
    description: "I can browse the internet, use email, and social media comfortably.",
  },
  {
    value: "Comfortable with office apps",
    description: "I use Word, Excel, or PowerPoint regularly for work or school.",
  },
  {
    value: "Technically experienced",
    description: "I've done some troubleshooting, spreadsheets, or coding before.",
  },
];

const SKILLS = [
  "Design & creativity",
  "Writing & communication",
  "Numbers & analysis",
  "Organizing & planning",
  "Talking to people / sales",
  "Fixing or tinkering with tech",
  "None of these yet",
];

const INTERESTS = [
  "Data analysis & AI",
  "Websites & office productivity",
  "Cybersecurity & digital marketing",
  "Business, startups & computer systems",
  "Not sure — open to suggestions",
];

const GOALS = [
  "Get a job in tech",
  "Improve my current job performance",
  "Start or grow my own business",
  "Just curious / personal growth",
];

const TOTAL_STEPS = 4;

interface FormState {
  name: string;
  whatsapp: string;
  educationLevel: string;
  fieldOfStudy: string;
  computerLiteracy: string;
  skills: string[];
  interests: string[];
  goal: string;
  notes: string;
}

const initialState: FormState = {
  name: "",
  whatsapp: "",
  educationLevel: "",
  fieldOfStudy: "",
  computerLiteracy: "",
  skills: [],
  interests: [],
  goal: "",
  notes: "",
};

const toggleValue = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export const CourseFinderPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canProceed = () => {
    if (step === 1) return form.name.trim() !== "" && form.whatsapp.trim() !== "";
    if (step === 2) return form.educationLevel !== "" && form.computerLiteracy !== "";
    if (step === 3) return form.interests.length > 0;
    return true;
  };

  const goNext = () => {
    if (!canProceed()) {
      setError("Please fill in the required fields before continuing.");
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const saveGuidanceRequest = async (data: FormState & { timestamp: string }) => {
    try {
      const response = await fetch("/api/course-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save guidance request");
      return await response.json();
    } catch (err) {
      console.error("Backend API error, falling back to localStorage:", err);
      const requests = JSON.parse(localStorage.getItem("guidanceRequests") || "[]");
      requests.push(data);
      localStorage.setItem("guidanceRequests", JSON.stringify(requests));
      return { success: true, fallback: true };
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canProceed()) {
      setError("Please tell us what you're interested in before submitting.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await saveGuidanceRequest({ ...form, timestamp: new Date().toISOString() });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Guidance request error:", err);
      setError("Something went wrong. Please try again or contact us directly at 08097545740.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-mint pt-32 pb-24 flex items-center">
        <div className="max-w-lg mx-auto px-6 sm:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-emerald-500 text-white flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            Got it, {form.name.split(" ")[0]}!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Our team will review your answers and reach out to you on WhatsApp within 24–48 hours
            with a course recommendation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/courses">Browse courses meanwhile</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all courses
        </Link>

        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-6">
            <Compass className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Not sure what to learn?
          </h1>
          <p className="text-lg text-gray-600">
            Answer a few quick questions and our team will recommend the right course for you.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i + 1 <= step ? "bg-purple-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10"
        >
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
            Step {step} of {TOTAL_STEPS}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Let's start with you</h2>
              <Field label="Full Name">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </Field>
              <Field label="WhatsApp Number">
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                  placeholder="+234 XXX XXX XXXX"
                  className={inputClass}
                />
                <small className="text-sm text-gray-500 mt-2 block">
                  This is how our team will reach you with a recommendation.
                </small>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Your background</h2>
                <p className="text-gray-600">This helps us pitch the course at the right level.</p>
              </div>

              <Field label="Level of education">
                <div className="grid sm:grid-cols-2 gap-3">
                  {EDUCATION_LEVELS.map((option) => (
                    <SelectCard
                      key={option}
                      label={option}
                      selected={form.educationLevel === option}
                      onClick={() => update("educationLevel", option)}
                    />
                  ))}
                </div>
              </Field>

              <Field label="What did you study (or are you studying)?" optional>
                <input
                  type="text"
                  value={form.fieldOfStudy}
                  onChange={(e) => update("fieldOfStudy", e.target.value)}
                  placeholder="e.g. Accounting, Mechanical Engineering, Nursing — or leave blank"
                  className={inputClass}
                />
              </Field>

              <Field label="Computer literacy">
                <div className="space-y-3">
                  {COMPUTER_LITERACY.map((option) => (
                    <SelectCard
                      key={option.value}
                      label={option.value}
                      description={option.description}
                      selected={form.computerLiteracy === option.value}
                      onClick={() => update("computerLiteracy", option.value)}
                    />
                  ))}
                </div>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Skills & interests</h2>
                <p className="text-gray-600">Pick as many as apply — there's no wrong answer.</p>
              </div>

              <Field label="Skills you already have" optional>
                <ChipGroup
                  options={SKILLS}
                  selected={form.skills}
                  onToggle={(value) => update("skills", toggleValue(form.skills, value))}
                />
              </Field>

              <Field label="What are you interested in?">
                <ChipGroup
                  options={INTERESTS}
                  selected={form.interests}
                  onToggle={(value) => update("interests", toggleValue(form.interests, value))}
                />
              </Field>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Your goal</h2>
                <p className="text-gray-600">What's driving you to learn something new?</p>
              </div>

              <Field label="Main goal">
                <div className="space-y-3">
                  {GOALS.map((option) => (
                    <SelectCard
                      key={option}
                      label={option}
                      selected={form.goal === option}
                      onClick={() => update("goal", option)}
                    />
                  ))}
                </div>
              </Field>

              <Field label="Anything else we should know?" optional>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Optional — share anything that'll help us recommend the right course."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 mt-6" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center gap-4 mt-10">
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}

            {step < TOTAL_STEPS ? (
              <Button key="continue-btn" type="button" onClick={goNext} className="ml-auto">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button key="submit-btn" type="submit" disabled={isSubmitting} className="ml-auto">
                <MessageCircle className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : "Get my recommendation"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const inputClass =
  "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all";

const Field = ({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">
      {label}
      {optional && (
        <span className="text-gray-400 normal-case font-normal ml-2">(optional)</span>
      )}
    </label>
    {children}
  </div>
);

const SelectCard = ({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
      selected
        ? "border-purple-600 bg-purple-50 ring-2 ring-purple-100"
        : "border-gray-300 bg-white hover:border-gray-400"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? "border-purple-600 bg-purple-600" : "border-gray-300"
        }`}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        {description && <div className="text-sm text-gray-600 mt-0.5">{description}</div>}
      </div>
    </div>
  </button>
);

const ChipGroup = ({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) => (
  <div className="flex flex-wrap gap-2.5">
    {options.map((option) => {
      const isSelected = selected.includes(option);
      return (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
            isSelected
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
        >
          {option}
        </button>
      );
    })}
  </div>
);
