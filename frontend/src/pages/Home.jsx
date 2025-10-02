import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { motion } from "framer-motion";
import API_BASE from "../config";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadBlogs = () => {
    fetch(`${API_BASE}/api/blogs?cb=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError("Failed to load blogs");
      });
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const onDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this blog?")) return;
    setError("");
    setDeletingId(id);
    const revertBlogs = [...blogs];
    setBlogs((prev) => prev.filter((b) => b._id !== id)); // Optimistic UI
    try {
      const res = await fetch(`${API_BASE}/api/blogs/${id}`, {
        method: "DELETE",
      });
      if (res.status === 404) return;
      if (!res.ok) throw new Error("Delete failed");
    } catch (e) {
      console.error("Delete failed", e);
      setError("Failed to delete blog. Please retry.");
      setBlogs(revertBlogs); // restore UI
    } finally {
      setDeletingId(null);
    }
  };

  return (
    // <div className="pt-28 px-4 md:px-10 lg:px-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
    <div className="pt-28 px-4 md:px-10 lg:px-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Explore AI-Powered Blogs
        </h1>
        <p className="mt-3 text-gray-600">
          Discover the latest AI-generated insights, thoughts, and ideas.
        </p>
      </motion.header>

      {/* Blog Grid */}
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <motion.article
              key={blog._id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02, y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white/50 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
            >
              {blog.images && blog.images.length > 0 && (
                <img
                  src={
                    blog.images[Math.floor(Math.random() * blog.images.length)]
                  }
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              )}

              <div className="p-5 flex flex-col gap-3">
                {/* Title */}
                <Link to={`/blog/${blog._id}`}>
                  <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent line-clamp-2">
                    {blog.title}
                  </h2>
                </Link>

                {/* Delete */}
                <button
                  aria-label={`Delete blog ${blog.title}`}
                  onClick={() => onDelete(blog._id)}
                  disabled={deletingId === blog._id}
                  className="text-red-500 hover:text-red-700 p-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  title={deletingId === blog._id ? "Deleting…" : "Delete"}
                >
                  {deletingId === blog._id ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    <MdDeleteForever size={22} />
                  )}
                </button>

                {/* Snippet */}
                <p className="text-gray-800 text-sm md:text-base line-clamp-2">
                  {blog.content?.replace(/[#*]+/g, "").substring(0, 120)}...
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-800 mt-2">
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-blue-600 hover:text-purple-600 font-medium transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No blogs available yet. Start by creating one!
          </p>
        )}
      </motion.section>
    </div>
  );
}
