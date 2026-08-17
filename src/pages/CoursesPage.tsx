import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Award, ArrowRight } from "lucide-react";
import { Course, coursesData, tracks } from "../data/courses";
import { accentStyles, getTrackAccent } from "../lib/trackAccent";

interface CourseCardProps {
  course: Course;
  onRegister: () => void;
}

const CourseCard = ({ course, onRegister }: CourseCardProps) => {
  const accent = accentStyles[getTrackAccent(course.track)];

  return (
    <div
      className={`bg-white border border-gray-200 border-l-4 ${accent.border} rounded-2xl overflow-hidden hover:shadow-xl transition-all`}
    >
      <div className="p-6 sm:p-8">
        <div className={`text-sm font-medium mb-2 ${accent.text}`}>
          {course.track}
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          {course.title}
        </h3>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>{course.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 flex-shrink-0" />
            <span>Certificate</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{course.overview}</p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            to={`/courses/${course.slug}`}
            className={`flex items-center gap-2 font-medium transition-colors ${accent.text} ${accent.textHover}`}
          >
            View full course details
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={onRegister}
            className="sm:ml-auto bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-all w-full sm:w-auto"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

interface CoursesPageProps {
  onRegisterClick: (courseName: string) => void;
}

export const CoursesPage = ({ onRegisterClick }: CoursesPageProps) => {
  const [selectedTrack, setSelectedTrack] = useState<string>("All");

  const filteredCourses =
    selectedTrack === "All"
      ? coursesData
      : coursesData.filter((course) => course.track === selectedTrack);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6">
            Our Courses
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Choose from {coursesData.length} industry-aligned programs designed to advance your tech career.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {["All", ...tracks].map((track) => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                selectedTrack === track
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-600"
              }`}
            >
              {track}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        <div className="grid gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onRegister={() => onRegisterClick(course.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
