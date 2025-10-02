// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// export default function Home() {
//   const [blogs, setBlogs] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/blogs")
//       .then((res) => res.json())
//       .then((data) => setBlogs(data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="pt-28 px-4 md:px-10 lg:px-16">
//       {/* Header */}
//       <header className="text-center mb-12">
//         <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Explore AI-Powered Blogs
//         </h1>
//         <p className="mt-3 text-gray-600">
//           Discover the latest AI-generated insights, thoughts, and ideas.
//         </p>
//       </header>

//       {/* Blog Grid */}
//       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {blogs.length > 0 ? (
//           blogs.map((blog) => (
//             <article
//               key={blog._id}
//               className="bg-white/50 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 overflow-hidden"
//             >
//               {/* Thumbnail */}
//               {blog.images && blog.images.length > 0 && (
//                 <img
//                   src={blog.images[0]}
//                   alt={blog.title}
//                   className="w-full h-48 object-cover rounded-t-2xl"
//                 />
//               )}

//               <div className="p-5 flex flex-col gap-3">
//                 {/* Title */}
//                 <Link to={`/blog/${blog._id}`}>
//                   <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent line-clamp-2">
//                     {blog.title}
//                   </h2>
//                 </Link>

//                 {/* Snippet */}
//                 <p className="text-gray-700 text-sm md:text-base line-clamp-2">
//                   {blog.content?.replace(/[#*]+/g, "").substring(0, 120)}...
//                 </p>

//                 {/* Footer */}
//                 <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
//                   <span>
//                     {new Date(blog.createdAt).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </span>
//                   <Link
//                     to={`/blog/${blog._id}`}
//                     className="text-blue-600 hover:text-purple-600 font-medium transition-colors"
//                   >
//                     Read more →
//                   </Link>
//                 </div>
//               </div>
//             </article>
//           ))
//         ) : (
//           <p className="text-center text-gray-500 col-span-full">
//             No blogs available yet. Start by creating one!
//           </p>
//         )}
//       </section>
//     </div>
//   );
// }
// <button
//             aria-label={`Delete blog ${blog.title}`}
//             onClick={() => onDelete(blog._id)}
//             disabled={deleting}
//             className="text-red-500 hover:text-red-700 p-1 disabled:opacity-40 disabled:cursor-not-allowed"
//             title={deleting ? "Deleting…" : "Delete"}
//           >
//             {deleting ? (
//               <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                 />
//               </svg>
//             ) : (
//               <MdDeleteForever size={22} />
//             )}
// </button>
          

//           <div>
//           <h2 className="text-md font-semibold text-gray-700 mb-3">
//             💡 Try one of these suggestions:
//           </h2>
//           <div className="flex flex-wrap gap-3">
//             {suggestions.map((s, i) => (
//               <button
//                 key={i}
//                 onClick={() => handleGenerate(s)}
//                 disabled={loading}
//                 className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 transition disabled:opacity-50"
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//         </div>