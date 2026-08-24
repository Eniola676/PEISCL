import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientBlurBgProps {
  children: ReactNode;
  className?: string;
}

export const GradientBlurBg = ({ children, className }: GradientBlurBgProps) => {
  return (
    <div className={cn("w-full bg-mint relative", className)}>
      {/* Purple + Green Gradient Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f0f0f0 1px, transparent 1px),
            linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
            radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent),
            radial-gradient(circle 700px at 0% 100%, #bdf0d3, transparent)
          `,
          backgroundSize: "96px 64px, 96px 64px, 100% 100%, 100% 100%",
        }}
      />
      {/* Your Content/Components */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
