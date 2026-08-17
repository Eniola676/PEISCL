import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { CoursesMarquee } from "../components/CoursesMarquee";
import { Testimonials } from "../components/Testimonials";
import { CTA } from "../components/CTA";

interface HomePageProps {
  onRegisterClick: () => void;
}

export const HomePage = ({ onRegisterClick }: HomePageProps) => {
  return (
    <>
      <Hero onRegisterClick={onRegisterClick} />
      <About />
      <CoursesMarquee />
      <Testimonials />
      <CTA onRegisterClick={onRegisterClick} />
    </>
  );
};
