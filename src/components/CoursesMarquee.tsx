import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { coursesData } from "../data/courses";
import { accentStyles, getTrackAccent } from "../lib/trackAccent";
import { Button } from "./ui/button";

const courses = coursesData.map((course) => ({
  title: course.title,
  accent: getTrackAccent(course.track),
}));

export const CoursesMarquee = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32 bg-mint overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-sm font-medium text-purple-600 uppercase tracking-wider mb-4">
              Our Programs
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
              <span className="text-emerald-600">{coursesData.length} courses.</span>{" "}
              <span className="text-purple-600">One mission.</span>
            </h2>
          </div>

          <Button
            variant="link"
            size="lg"
            onClick={() => navigate("/courses")}
            className="text-gray-900 no-underline hover:text-purple-600 hover:no-underline group"
          >
            View all courses
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-mint to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-mint to-transparent z-10" />

        {/* Marquee track */}
        <div className="marquee-container">
          <div className="marquee-content">
            {[...courses, ...courses].map((course, index) => (
              <div
                key={index}
                className="marquee-item inline-flex items-center gap-3 justify-center px-8 py-6 bg-gray-50 rounded-2xl border border-gray-200 mx-3"
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${accentStyles[course.accent].dot}`} />
                <span className="text-xl font-medium text-gray-900 whitespace-nowrap">
                  {course.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
