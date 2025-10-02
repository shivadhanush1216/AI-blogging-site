import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import API_BASE from "../config";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (!id) return;
    let aborted = false;
    fetch(`${API_BASE}/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!aborted) setBlog(data);
      })
      .catch((err) => console.error(err));
    return () => {
      aborted = true;
    };
  }, [id]);

  if (!blog) {
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;
  }

  return (
    <div className="pt-28 px-4 md:px-10 lg:px-32">
      <article className="bg-white/50 backdrop-blur-lg border border-white/30 rounded-3xl shadow-lg p-8 md:p-12">
        {/* Blog Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          {blog.title}
        </h1>

        {/* Date */}
        <p className="text-gray-500 text-sm mb-6">
          Published on{" "}
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Image */}
        {(blog.images && blog.images.length > 0 && (
          <img
            src={blog.images[0]}
            alt={blog.title}
            className="w-full max-h-[500px] object-cover rounded-2xl mb-8 shadow-md"
          />
        )) || (
          <div className="bg-gray-200 text-gray-500 text-center py-10 rounded-lg">
            📷 No image available
          </div>
        )}

        {/* Content with Markdown Enhancement */}
        <div className="prose prose-lg max-w-none text-gray-800">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-500 pl-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="leading-relaxed text-gray-700" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="text-purple-600" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-600 underline hover:text-purple-600 transition-colors"
                  {...props}
                />
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        {/* Back Button */}
        <div className="mt-10">
          <Link
            to="/"
            className="inline-block px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:scale-105 transition-transform"
          >
            ← Back to Blogs
          </Link>
        </div>
      </article>
    </div>
  );
}
