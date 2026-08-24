import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

const ADDRESS = "Garki, Abuja 900103, Federal Capital Territory";
const MAP_COORDS = "9.0333,7.4833";
const MAP_BBOX = "7.4633,9.0133,7.5033,9.0533";

const saveSubscriber = async (email: string) => {
  const payload = { email, timestamp: new Date().toISOString() };
  try {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to save subscriber");
    return await response.json();
  } catch (error) {
    console.error("Backend API error, falling back to localStorage:", error);
    const subscribers = JSON.parse(localStorage.getItem("newsletterSubscribers") || "[]");
    subscribers.push(payload);
    localStorage.setItem("newsletterSubscribers", JSON.stringify(subscribers));
    return { success: true, fallback: true };
  }
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await saveSubscriber(email.trim());
      setIsSubscribed(true);
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-mint text-gray-600 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Newsletter */}
          <div className="relative lg:col-span-1">
            <div
              className="absolute -right-6 -top-10 h-28 w-28 rounded-full bg-purple-400/15 blur-2xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute right-4 top-16 h-20 w-20 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="flex items-center gap-3 mb-5">
              <img
                src="/logo.jpeg"
                alt="PEISCL"
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
              />
              <div className="text-xl font-semibold text-gray-900">PEISCL</div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-3">
              Stay in the loop
            </h2>
            <p className="text-gray-600 mb-6 max-w-xs">
              New courses, cohort dates, and career tips — straight to your inbox.
            </p>

            {isSubscribed ? (
              <p className="text-sm text-emerald-600 font-medium">
                You're on the list — thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="relative max-w-xs">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-4 pr-12 py-3 rounded-full bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all"
                />
                <Button
                  type="submit"
                  size="icon-sm"
                  disabled={isSubmitting}
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 hover:bg-purple-500"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3 text-sm">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors w-fit">
                Home
              </Link>
              <Link to="/courses" className="text-gray-600 hover:text-gray-900 transition-colors w-fit">
                Courses
              </Link>
              <Link
                to="/find-my-course"
                className="text-gray-600 hover:text-gray-900 transition-colors w-fit"
              >
                Find My Course
              </Link>
              <Link to="/#about" className="text-gray-600 hover:text-gray-900 transition-colors w-fit">
                About
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <a href="tel:08097545740" className="text-gray-600 hover:text-gray-900 transition-colors">
                  08097545740
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <a
                  href="mailto:ictpanorama5@gmail.com"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ictpanorama5@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {ADDRESS}
                </a>
              </li>
            </ul>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
              target="_blank"
              rel="noreferrer"
              className="block mt-4 rounded-xl overflow-hidden border border-gray-300 hover:border-gray-400 transition-colors"
              aria-label="Open PEISCL location in Google Maps"
            >
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik&marker=${MAP_COORDS}`}
                className="w-full h-36 pointer-events-none"
                loading="lazy"
                title="PEISCL location map"
              />
            </a>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Connect With Us
            </h3>
            <div className="flex gap-3">
              <Button asChild variant="outline" size="icon" className="text-gray-600 hover:text-gray-900">
                <a href="https://wa.me/2348097545740" target="_blank" rel="noreferrer" title="Chat on WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                  <span className="sr-only">WhatsApp</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="icon" className="text-gray-600 hover:text-gray-900">
                <a href="tel:08097545740" title="Call us">
                  <Phone className="w-4 h-4" />
                  <span className="sr-only">Call us</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="icon" className="text-gray-600 hover:text-gray-900">
                <a href="mailto:ictpanorama5@gmail.com" title="Email us">
                  <Mail className="w-4 h-4" />
                  <span className="sr-only">Email us</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-300/70 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} PEISCL. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with ❤️ for tech education
          </p>
        </div>
      </div>
    </footer>
  );
};
