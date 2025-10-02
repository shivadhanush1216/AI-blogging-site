import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";

export default function Navbar() {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <nav
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] z-50 
      backdrop-blur-xl bg-white/40 dark:bg-gray-900/60 
      border border-gray-200 dark:border-gray-700 
      shadow-lg rounded-2xl transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Brand */}
        <Link
          to="/"
          className="font-extrabold text-2xl tracking-tight 
          bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent
          hover:from-purple-500 hover:to-pink-600 transition-all"
        >
          AI Blogging
        </Link>

        {/* Links */}
        <div className="flex space-x-6 items-center">
          <Link
            to="/"
            className="relative text-gray-800 dark:text-gray-300 font-medium 
              hover:text-blue-600 dark:hover:text-purple-400 transition-colors 
              after:content-[''] after:block after:w-0 after:h-[2px] 
              after:bg-gradient-to-r after:from-blue-500 after:to-purple-600 
              after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
          <Link
            to="/create"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
            text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-transform"
          >
            ✨ Create Blog
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 
            text-gray-800 dark:text-yellow-300 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
