import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Users, Award, CheckCircle2 } from "lucide-react";
import { getCourseBySlug } from "../data/courses";
import { accentStyles, getTrackAccent } from "../lib/trackAccent";

interface CourseDetailPageProps {
  onRegisterClick: (courseName: string) => void;
}

export const CourseDetailPage = ({ onRegisterClick }: CourseDetailPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const course = slug ? getCourseBySlug(slug) : undefined;

  const accent = course ? accentStyles[getTrackAccent(course.track)] : accentStyles.purple;

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Course not found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We couldn't find the course you're looking for.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all courses
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className={`text-sm font-medium mb-3 ${accent.text}`}>
            {course.track}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            {course.title}
          </h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-sm text-gray-600">
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
              <span>Certificate of completion</span>
            </div>
          </div>

          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            {course.overview}
          </p>
        </div>

        {/* Details grid */}
        {(course.objectives || course.prerequisites || course.targetAudience || course.equipment) && (
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-10 mb-12">
            {course.objectives && (
              <DetailList title="Course Objectives" items={course.objectives} />
            )}
            {course.prerequisites && (
              <DetailList title="Prerequisites" items={course.prerequisites} />
            )}
            {course.targetAudience && (
              <DetailList title="Who This Course Is For" items={course.targetAudience} />
            )}
            {course.equipment && (
              <DetailList title="Equipment & Requirements" items={course.equipment} />
            )}
          </div>
        )}

        {/* Curriculum */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            Course Curriculum
          </h2>
          <div className="space-y-4">
            {course.modules.map((module, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  {module.title}
                </h3>
                <ul className="space-y-2">
                  {module.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${accent.dot}`} />
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Outcomes & Assessment */}
        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Learning Outcomes
            </h2>
            <ul className="space-y-2">
              {course.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {course.assessment && (
            <DetailList title="Assessment" items={course.assessment} />
          )}
        </div>

        {/* Register CTA */}
        <button
          onClick={() => onRegisterClick(course.title)}
          className="w-full bg-indigo-600 text-white py-4 rounded-full font-medium hover:bg-indigo-700 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Register for this course
        </button>
      </div>
    </div>
  );
};

const DetailList = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
