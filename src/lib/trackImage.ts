const trackImageMap: Record<string, string> = {
  "Data & AI": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800",
  "Web & Office Skills": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800",
  "Digital & Security": "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800",
  "Systems & Startup": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800",
};

export const getTrackImage = (track: string) =>
  trackImageMap[track] ?? trackImageMap["Data & AI"];
