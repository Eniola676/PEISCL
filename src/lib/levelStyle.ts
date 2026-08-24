import { Level } from "../data/courses";

export const levelStyles: Record<
  Level,
  { text: string; bg: string; badgeBg: string; badgeText: string; ring: string; description: string }
> = {
  Beginner: {
    text: "text-emerald-600",
    bg: "bg-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    ring: "ring-emerald-600",
    description: "New to the subject? Start here — no prior experience assumed.",
  },
  Intermediate: {
    text: "text-purple-600",
    bg: "bg-purple-600",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    ring: "ring-purple-600",
    description: "You know the basics and are ready to build real skills.",
  },
  Advanced: {
    text: "text-amber-600",
    bg: "bg-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    ring: "ring-amber-600",
    description: "For experienced learners ready to master specialized, in-demand skills.",
  },
};
