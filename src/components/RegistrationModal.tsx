import { useState, FormEvent, useEffect } from "react";
import { coursesData, tracks } from "../data/courses";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse?: string;
  onSuccess: () => void;
}

const allCourses = tracks.map((track) => ({
  track,
  courses: coursesData.filter((course) => course.track === track).map((course) => course.title),
}));

export const RegistrationModal = ({
  isOpen,
  onClose,
  selectedCourse,
  onSuccess,
}: RegistrationModalProps) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [program, setProgram] = useState(selectedCourse || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCourse) {
      setProgram(selectedCourse);
    }
  }, [selectedCourse]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name,
      whatsapp,
      program,
      timestamp: new Date().toISOString(),
    };

    try {
      // Save to backend
      await saveRegistration(formData);

      // Send WhatsApp confirmation
      await sendWhatsAppMessage(formData);

      // Reset form
      setName("");
      setWhatsapp("");
      setProgram("");

      // Close modal and show success
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again or contact us directly at 08097545740");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveRegistration = async (data: any) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save registration");
      return await response.json();
    } catch (error) {
      console.error("Backend API error, falling back to localStorage:", error);
      const registrations = JSON.parse(localStorage.getItem("registrations") || "[]");
      registrations.push(data);
      localStorage.setItem("registrations", JSON.stringify(registrations));
      return { success: true, fallback: true };
    }
  };

  const sendWhatsAppMessage = async (data: any) => {
    try {
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.whatsapp,
          name: data.name,
          program: data.program,
        }),
      });

      if (!response.ok) console.warn("WhatsApp API returned error, but continuing...");
      return await response.json();
    } catch (error) {
      console.error("WhatsApp API error:", error);
      return { success: false, error: error };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-lg animate-fade-in"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-3xl text-gray-500 hover:text-gray-900"
        >
          ×
        </button>

        <h2 className="text-4xl font-semibold mb-3 tracking-tight">
          Register your interest
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          We'll reach out via WhatsApp with next steps.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900 uppercase tracking-wide mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="whatsapp"
              className="block text-sm font-medium text-gray-900 uppercase tracking-wide mb-2"
            >
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              placeholder="+234 XXX XXX XXXX"
              pattern="[\+]?[0-9]{10,15}"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
            <small className="text-sm text-gray-500 mt-2 block">
              Include country code (e.g., +234)
            </small>
          </div>

          <div className="mb-8">
            <label
              htmlFor="program"
              className="block text-sm font-medium text-gray-900 uppercase tracking-wide mb-2"
            >
              Program of Interest
            </label>
            <select
              id="program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
            >
              <option value="">Select a course</option>
              {allCourses.map((track) => (
                <optgroup key={track.track} label={track.track}>
                  {track.courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white text-lg font-medium px-8 py-4 rounded-full hover:bg-indigo-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};
