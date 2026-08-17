import { useEffect, useRef, useState } from "react";

interface Course {
  name: string;
  tag: string;
}

interface TrackSectionProps {
  number: string;
  title: string;
  description: string;
  courses: Course[];
  onRegister: (track: string) => void;
}

export const TrackSection = ({
  number,
  title,
  description,
  courses,
  onRegister,
}: TrackSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-24 md:py-32 min-h-[80vh] flex items-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="text-9xl sm:text-[10rem] md:text-[12rem] font-bold text-gray-200 opacity-30 leading-none mb-4">
          {number}
        </div>
        <h3 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6">
          {title}
        </h3>
        <p className="text-2xl sm:text-3xl text-gray-600 mb-12 max-w-2xl">
          {description}
        </p>

        <ul className="mb-12 space-y-0">
          {courses.map((course, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-6 border-b border-gray-300 transition-all hover:pl-4"
            >
              <span className="text-xl sm:text-2xl font-medium text-gray-900">
                {course.name}
              </span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {course.tag}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onRegister(title)}
          className="bg-gray-900 text-white text-lg font-medium px-10 py-4 rounded-full hover:bg-black transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          Register for this track
        </button>
      </div>
    </section>
  );
};
