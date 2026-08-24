import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "[Student Name 1]",
    role: "[Role/Title]",
    content:
      "[Testimonial content - to be provided. Share your experience with PEISCL training programs.]",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    name: "[Student Name 2]",
    role: "[Role/Title]",
    content:
      "[Testimonial content - to be provided. Describe the impact of the training on your career.]",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    name: "[Student Name 3]",
    role: "[Role/Title]",
    content:
      "[Testimonial content - to be provided. Share specific skills learned and how they helped you.]",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
];

export const Testimonials = () => {
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
            Success Stories
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
            Loved by the community
          </h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="break-inside-avoid mb-6 bg-white rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              <blockquote className="text-gray-600 leading-relaxed">
                "{testimonial.content}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
