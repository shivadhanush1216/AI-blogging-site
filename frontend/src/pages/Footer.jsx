import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 mb-4 w-[95%] md:w-[90%] mx-auto backdrop-blur-xl bg-white/30 border border-white/20 shadow-lg rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-start justify-between">
        {/* Brand */}
        <div className="text-center md:text-left">
          <h2 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            AI Blogging
          </h2>
          <p className="text-gray-600 text-sm mt-2 max-w-xs">
            Create, discover & share AI‑generated insights.
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/create" className="hover:text-purple-600 transition-colors">
            Create Blog
          </Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            GitHub
          </a>
        </nav>

        {/* Social */}
        <div className="flex gap-5 text-gray-500">
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin text-xl"></i>
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
            aria-label="GitHub"
          >
            <i className="fab fa-github text-xl"></i>
          </a>
        </div>
      </div>
      <div className="border-t border-white/20 px-6 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} AI Blogging • All rights reserved.
      </div>
    </footer>
  );
}
