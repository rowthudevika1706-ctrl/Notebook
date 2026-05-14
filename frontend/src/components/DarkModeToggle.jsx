import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.theme === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Update the class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="flex items-center justify-between w-16 p-1 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300 relative"
    >
      {/* Toggle Ball */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-black shadow-md transform transition-transform duration-300 ${
          darkMode ? "translate-x-8" : "translate-x-0"
        }`}
      />

      {/* Icons */}
      <Sun className="w-4 h-4 ml-1 text-yellow-500" />
      <Moon className="w-4 h-4 mr-1 text-gray-900 dark:text-gray-100" />
    </button>
  );
};

export default DarkModeToggle;
