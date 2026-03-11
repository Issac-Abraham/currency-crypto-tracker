import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

const Home = lazy(() => import("./pages/Home"));
const Converter = lazy(() => import("./pages/Converter"));
const Crypto = lazy(() => import("./pages/Crypto"));

const THEME_STORAGE_KEY = "themePreference";

const getInitialDarkMode = (): boolean => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "dark") {
    return true;
  }
  if (storedTheme === "light") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
        <Navbar
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        />
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-gray-600 dark:text-gray-300 sm:px-6 lg:px-8">
              Loading page...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/crypto" element={<Crypto />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
