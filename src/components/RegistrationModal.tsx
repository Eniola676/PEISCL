import { useState, FormEvent, useEffect } from "react";
import { Check, MapPin, Video } from "lucide-react";
import { coursesData, tracks } from "../data/courses";
import { locations, allLocationIds, LocationId } from "../data/locations";
import { buildWhatsAppLink, registrationMessage } from "../lib/whatsapp";
import { Button } from "./ui/button";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse?: string;
  onSuccess: (whatsappLink: string) => void;
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
  const [location, setLocation] = useState<LocationId | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedCourseData = coursesData.find((c) => c.title === program);
  const availableLocationIds = selectedCourseData ? selectedCourseData.locations : allLocationIds;

  useEffect(() => {
    if (selectedCourse) {
      setProgram(selectedCourse);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (location && !availableLocationIds.includes(location)) {
      setLocation("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!location) return;

    setIsSubmitting(true);
    setError("");

    const locationName = locations[location].name;
    const formData = {
      name,
      whatsapp,
      program,
      location,
      locationName,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail?.error || "Failed to save registration");
      }

      // Hand the details off to support over WhatsApp.
      const link = buildWhatsAppLink(
        registrationMessage({ name, whatsapp, program, locationName })
      );

      setName("");
      setWhatsapp("");
      setProgram("");
      setLocation("");

      onClose();
      onSuccess(link);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        "We couldn't submit your registration. Please try again, or reach us directly on 08097545740."
      );
    } finally {
      setIsSubmitting(false);
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
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-6 right-6 text-3xl text-gray-500 hover:text-gray-900"
          aria-label="Close"
        >
          ×
        </Button>

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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
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

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-900 uppercase tracking-wide mb-2">
              Preferred Location
            </label>
            <div className="space-y-2.5">
              {availableLocationIds.map((id) => {
                const loc = locations[id];
                const selected = location === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setLocation(id)}
                    className={`w-full flex items-start gap-3 text-left px-4 py-3 rounded-xl border transition-all ${
                      selected
                        ? "border-purple-600 bg-purple-50 ring-2 ring-purple-100"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selected ? "border-purple-600 bg-purple-600" : "border-gray-300"
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex items-start gap-2 min-w-0">
                      {loc.type === "virtual" ? (
                        <Video className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900">{loc.name}</div>
                        <div className="text-sm text-gray-600">{loc.address}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 mb-4" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !location}
            className="w-full hover:-translate-y-1 hover:shadow-2xl"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};
