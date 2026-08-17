export type TrackAccent = "purple" | "green";

const trackAccentMap: Record<string, TrackAccent> = {
  "Data & AI": "purple",
  "Digital & Security": "purple",
  "Web & Office Skills": "green",
  "Systems & Startup": "green",
};

export const getTrackAccent = (track: string): TrackAccent =>
  trackAccentMap[track] ?? "purple";

export const accentStyles: Record<
  TrackAccent,
  { text: string; textHover: string; border: string; dot: string; bgSoft: string }
> = {
  purple: {
    text: "text-indigo-600",
    textHover: "hover:text-indigo-700",
    border: "border-l-indigo-600",
    dot: "bg-indigo-600",
    bgSoft: "bg-indigo-50",
  },
  green: {
    text: "text-emerald-600",
    textHover: "hover:text-emerald-700",
    border: "border-l-emerald-600",
    dot: "bg-emerald-600",
    bgSoft: "bg-emerald-50",
  },
};
