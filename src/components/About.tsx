import { useEffect, useRef, useState } from "react";
import { Award, Users, BookOpen, TrendingUp } from "lucide-react";
import { ScrollVelocity } from "./ui/scroll-velocity";
import { coursesData } from "../data/courses";

const images = [
  {
    title: "Training Session 1",
    thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=640",
  },
  {
    title: "Students Learning",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=640",
  },
  {
    title: "Classroom Environment",
    thumbnail: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=640",
  },
  {
    title: "Tech Workshop",
    thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=640",
  },
  {
    title: "Collaborative Learning",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=640",
  },
  {
    title: "Training Session 2",
    thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=640",
  },
  {
    title: "Students Learning 2",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=640",
  },
  {
    title: "Classroom Environment 2",
    thumbnail: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=640",
  },
];

const velocity = [3, -3];

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
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

  const stats = [
    { icon: Users, label: "Students Trained", value: "[500+]", accent: "text-purple-600" },
    { icon: BookOpen, label: "Courses Offered", value: String(coursesData.length), accent: "text-emerald-600" },
    { icon: Award, label: "Industry Partners", value: "[10+]", accent: "text-purple-600" },
    { icon: TrendingUp, label: "Success Rate", value: "[95%]", accent: "text-emerald-600" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`py-24 md:py-32 bg-mint transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Content */}
          <div>
            <div className="text-sm font-medium text-purple-600 uppercase tracking-wider mb-4">
              About PEISCL
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6">
              Transforming professionals through tech education
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
              PEISCL is Nigeria's premier tech skills training institute,
              dedicated to equipping professionals and aspiring technologists with
              cutting-edge digital competencies.
            </p>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              From data analysis and AI to cybersecurity and startup strategy,
              we deliver practical, industry-aligned training that prepares you
              for the future of work.
            </p>
          </div>

          {/* Right: Stats */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 mb-3 sm:mb-4 ${stat.accent}`} />
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Image Carousel Marquee */}
        <div className="w-full space-y-5">
          {velocity.map((v, index) => (
            <ScrollVelocity key={index} velocity={v} className="py-2">
              {images.map(({ title, thumbnail }) => (
                <div
                  key={title}
                  className="relative h-[6rem] w-[9rem] md:h-[8rem] md:w-[12rem] xl:h-[12rem] xl:w-[18rem] rounded-xl overflow-hidden"
                >
                  <img
                    src={thumbnail}
                    alt={title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </ScrollVelocity>
          ))}
        </div>
      </div>
    </section>
  );
};
