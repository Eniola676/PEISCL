import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 relative">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.jpeg"
                alt="PEISCL"
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
              />
              <div className="text-2xl font-semibold text-white">
                PEISCL
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Nigeria's premier tech skills training institute, transforming
              professionals through cutting-edge digital education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  className="hover:text-indigo-400 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-400" />
                <a
                  href="tel:08097545740"
                  className="hover:text-indigo-400 transition-colors"
                >
                  08097545740
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-400" />
                <a
                  href="mailto:ictpanorama5@gmail.com"
                  className="hover:text-indigo-400 transition-colors"
                >
                  ictpanorama5@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-400 mt-1" />
                <span className="text-gray-400">[Location - TBD]</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
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
