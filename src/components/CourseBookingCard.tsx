import { ArrowRight } from "lucide-react";
import { Course } from "../data/courses";
import { getTrackImage } from "../lib/trackImage";
import { Button } from "./ui/button";

interface CourseBookingCardProps {
  course: Course;
  onRegister: () => void;
}

export const CourseBookingCard = ({ course, onRegister }: CourseBookingCardProps) => {
  return (
    <div className="rounded-3xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl">
      {/* Image */}
      <div className="relative h-56 sm:h-64">
        <img
          src={getTrackImage(course.track)}
          alt={course.track}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7">
        <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap mb-3">
          {course.levels.join(" – ")}
        </span>

        <h3 className="text-2xl font-bold text-white leading-tight mb-3">
          {course.title}
        </h3>

        <p className="text-gray-400 mb-4">
          {course.duration} • {course.track}
        </p>

        <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
          {course.overview}
        </p>

        <div className="flex items-center justify-between gap-4 pt-5 border-t border-white/10">
          <div>
            <span className="text-xl font-bold text-white">Certificate</span>
            <span className="text-gray-400"> of completion</span>
          </div>

          <Button
            variant="secondary"
            onClick={onRegister}
            className="bg-white text-gray-900 border-transparent hover:bg-gray-100 hover:-translate-y-0.5 flex-shrink-0"
          >
            Register
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
