import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { levels, Level } from "../data/courses";
import { levelStyles } from "../lib/levelStyle";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface CTAProps {
  onRegisterClick: () => void;
}

const levelImages: Record<Level, string> = {
  Beginner: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200",
  Intermediate: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200",
  Advanced: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
};

const steps = [
  {
    title: "Tell us your goals",
    description:
      "Share your background, interests, and what you hope to achieve — takes less than 2 minutes.",
  },
  {
    title: "Explore matching courses",
    description:
      "Browse tracks and levels tailored to where you're starting from, from Beginner to Advanced.",
  },
  {
    title: "Register and start learning",
    description:
      "Reserve your spot and our team reaches out on WhatsApp with everything you need to begin.",
  },
];

export const CTA = ({ onRegisterClick }: CTAProps) => {
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState<Level>("Beginner");

  return (
    <section className="bg-mint py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white">
          <div
            className="absolute -left-16 -top-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Left: content */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <span className="w-fit rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium mb-6">
                How It Works
              </span>

              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6">
                Training that adapts to your goals.
              </h2>

              <p className="text-lg text-gray-400 mb-8 max-w-lg">
                Turn your ambition into a career — whether it's data &amp; AI,
                cybersecurity, web skills, or entrepreneurship. Tell us where
                you're starting from, and we'll help you find the right path.
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {["13 courses", "4 tracks", "WhatsApp support"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Accordion type="single" collapsible className="mb-10 border-white/10">
                {steps.map((step, index) => (
                  <AccordionItem
                    key={step.title}
                    value={`step-${index}`}
                    className="border-white/10"
                  >
                    <AccordionTrigger className="text-lg hover:no-underline">
                      {step.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 text-base">
                      {step.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={onRegisterClick} className="bg-white text-gray-900 border-transparent hover:bg-gray-100">
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/courses")}
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Browse Courses
                </Button>
              </div>
            </div>

            {/* Right: image + level tabs */}
            <div className="relative min-h-[24rem] lg:min-h-0 p-4 lg:p-6">
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                <img
                  src={levelImages[activeLevel]}
                  alt={`${activeLevel} track preview`}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute bottom-24 left-6 right-6 sm:bottom-28">
                  <div className="text-2xl font-semibold mb-1">{activeLevel} Track</div>
                  <p className="text-gray-300 text-sm max-w-sm">
                    {levelStyles[activeLevel].description}
                  </p>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex justify-center">
                  <div className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md p-1.5 border border-white/10">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setActiveLevel(level)}
                        className={`px-4 py-3 sm:py-2.5 rounded-full text-sm font-medium transition-colors ${
                          activeLevel === level
                            ? "bg-white text-gray-900"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
