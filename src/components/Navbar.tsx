import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onRegisterClick: () => void;
}

export const Navbar = ({ onRegisterClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/#about" },
  ];

  const isActive = (path: string) => {
    if (path.startsWith("/#")) return false; // Hash links on home
    return location.pathname === path;
  };

  const handleLinkClick = (path: string) => {
    if (path.startsWith("/#")) {
      const element = document.getElementById(path.substring(2));
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <img
              src="/logo.jpeg"
              alt="PEISCL"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover flex-shrink-0"
            />
            <span className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              PEISCL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={onRegisterClick}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
            >
              Register Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 flex-shrink-0"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`text-base font-medium transition-colors py-2.5 ${
                    isActive(link.path)
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <button
                onClick={() => {
                  onRegisterClick();
                  setIsMenuOpen(false);
                }}
                className="mt-3 bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-all text-center"
              >
                Register Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
