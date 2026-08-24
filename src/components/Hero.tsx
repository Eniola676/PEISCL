import { GradientBlurBg } from "./ui/gradient-blur-bg";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onRegisterClick: () => void;
}

export const Hero = ({ onRegisterClick }: HeroProps) => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    aboutSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <GradientBlurBg className="min-h-screen flex items-center justify-center pt-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-tight text-gray-900 mb-6 animate-fade-in">
          Master the skills that matter.
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-in-delay font-light">
          PEISCL delivers world-class tech training designed for
          professionals ready to lead.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
          <Button
            size="lg"
            onClick={onRegisterClick}
            className="shadow-lg hover:-translate-y-1 hover:shadow-2xl"
          >
            Register Now
          </Button>

          <Button
            variant="link"
            size="lg"
            onClick={scrollToAbout}
            className="text-gray-900 no-underline hover:text-purple-600 hover:no-underline group"
          >
            Learn more
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </GradientBlurBg>
  );
};
