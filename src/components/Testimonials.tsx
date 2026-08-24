import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";

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
            Trusted by professionals
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all"
            >
              <Quote className="w-10 h-10 text-purple-600 mb-6" />

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
