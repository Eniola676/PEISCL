import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Amina Yusuf",
    role: "Excel Fundamentals learner",
    content:
      "I used to rely on colleagues whenever I had to clean a spreadsheet or summarise figures. The Excel training helped me practise formulas, sorting and charts with examples I could follow. I'm now more confident preparing my team's weekly reports.",
  },
  {
    name: "Chinedu Okafor",
    role: "WordPress Web Design learner",
    content:
      "I wanted to understand what it takes to get a small business website online. The course walked me through choosing a domain, setting up WordPress and building the pages. I left knowing the steps I need to take for my own project.",
  },
  {
    name: "Fatima Bello",
    role: "Cybersecurity Awareness learner",
    content:
      "The training made everyday security risks easier to recognise. I learned what to check before opening links or sharing information, and how to make safer choices with my accounts. Those are habits I can use at work and at home.",
  },
];

/** "Amina Yusuf" -> "AY". Used instead of a photo until we have real ones. */
const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
                <div
                  aria-hidden="true"
                  className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold flex items-center justify-center flex-shrink-0"
                >
                  {initials(testimonial.name)}
                </div>
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
