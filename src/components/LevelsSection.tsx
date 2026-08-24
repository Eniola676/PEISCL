import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sprout, TrendingUp, Trophy } from "lucide-react";
import { coursesData, levels, Level } from "../data/courses";
import { levelStyles } from "../lib/levelStyle";

const levelIcons: Record<Level, typeof Sprout> = {
  Beginner: Sprout,
  Intermediate: TrendingUp,
  Advanced: Trophy,
};

export const LevelsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-24 md:py-32 bg-mint transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <div className="text-sm font-medium text-purple-600 uppercase tracking-wider mb-4">
            Wherever You're Starting From
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6">
            Find your level
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every course is tagged by difficulty, so you can jump in at the right point.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {levels.map((level) => {
            const Icon = levelIcons[level];
            const style = levelStyles[level];
            const count = coursesData.filter((c) => c.levels.includes(level)).length;

            return (
              <Link
                key={level}
                to={`/courses?level=${encodeURIComponent(level)}`}
                className="group bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-3xl p-8 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${style.badgeBg} flex items-center justify-center mb-6`}
                >
                  <Icon className={`w-7 h-7 ${style.text}`} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{level}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{style.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    {count} {count === 1 ? "course" : "courses"}
                  </span>
                  <span
                    className={`flex items-center gap-1 font-medium ${style.text} group-hover:gap-2 transition-all`}
                  >
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
