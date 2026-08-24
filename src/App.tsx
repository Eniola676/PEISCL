import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { RegistrationModal } from "./components/RegistrationModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { HomePage } from "./pages/HomePage";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { CourseFinderPage } from "./pages/CourseFinderPage";

function App() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>();

  const handleRegisterClick = (courseName?: string) => {
    setSelectedCourse(courseName);
    setIsRegistrationOpen(true);
  };

  const handleRegistrationSuccess = () => {
    setIsConfirmationOpen(true);
  };

  return (
    <BrowserRouter>
      <div className="bg-white">
        <Navbar onRegisterClick={() => handleRegisterClick()} />

        <Routes>
          <Route
            path="/"
            element={<HomePage onRegisterClick={() => handleRegisterClick()} />}
          />
          <Route
            path="/courses"
            element={<CoursesPage onRegisterClick={handleRegisterClick} />}
          />
          <Route
            path="/courses/:slug"
            element={<CourseDetailPage onRegisterClick={handleRegisterClick} />}
          />
          <Route path="/find-my-course" element={<CourseFinderPage />} />
        </Routes>

        <Footer />

        {/* Modals */}
        <RegistrationModal
          isOpen={isRegistrationOpen}
          onClose={() => setIsRegistrationOpen(false)}
          selectedCourse={selectedCourse}
          onSuccess={handleRegistrationSuccess}
        />

        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
