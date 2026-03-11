import { useState } from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const navItems = [
  { label: "Home", to: "/" },
  { label: "Converter", to: "/converter" },
  { label: "Crypto", to: "/crypto" },
];

const Navbar = ({ isDarkMode, onToggleTheme }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-indigo-500"
        : "text-gray-700 hover:text-indigo-500 dark:text-gray-200 dark:hover:text-indigo-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="text-lg font-bold text-gray-900 transition-colors duration-200 hover:text-indigo-500 dark:text-white dark:hover:text-indigo-400"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          💱 CryptoTracker
        </NavLink>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses}>
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-lg bg-gray-100 px-3 py-2 text-lg transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <button
          type="button"
          className="rounded-lg bg-gray-100 p-2 text-gray-900 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 md:hidden"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClasses}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={onToggleTheme}
              className="mt-1 w-fit rounded-lg bg-gray-100 px-3 py-2 text-lg transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
