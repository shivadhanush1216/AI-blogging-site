import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE from "../config";
import { IoChevronBackOutline } from "react-icons/io5";

export default function Create() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [blogText, setBlogText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const navigate = useNavigate();

  const suggestions = [
    "The Future of Artificial Intelligence in Healthcare",
    "Sustainable Living in the Modern World",
    "The Rise of Remote Work Culture",
    "The Evolution of Electric Vehicles",
    "Mindfulness in the Digital Era",
    "How Social Media is Changing Communication",
  ];

  // ------------ STREAM GENERATION -------------
  const handleStreamGenerate = async (customPrompt) => {
    const finalPrompt = customPrompt || prompt.trim();
    if (!finalPrompt) {
      setError("⚠️ Please enter a topic");
      return;
    }

    setPrompt(finalPrompt);
    setLoading(true);
    setError("");
    setBlogText("");
    setShowSuggestions(false);

    try {
      const response = await fetch(`${API_BASE}/api/blogs/generate-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!response.body) throw new Error("No stream body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });

        chunk.split("\n\n").forEach((line) => {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "");
            if (data === "[DONE]") {
              done = true;
              return;
            }
            if (!data.startsWith("ERROR")) {
              setBlogText((prev) => prev + data);
            } else {
              setError(data);
            }
          }
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to stream");
    } finally {
      setLoading(false);
    }
  };

  // ------------ SAVE BLOG -------------
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/blogs/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (!res.ok || !data._id) throw new Error();

      showToast("success", "✅ Blog saved successfully!");
      setTimeout(() => {
        navigate(`/blog/${data._id}`);
      }, 1500);
    } catch (err) {
      console.error("Save failed", err);
      showToast("error", "❌ Failed to save blog!");
      setSaving(false);
    }
  };

  // ------------ TOAST HANDLER -------------
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 dark:bg-gray-900 bg-gray-50 transition-colors">
      <div
        className="w-full max-w-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
        border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 relative mt-24"
      >
        {/* ✅ Toast */}
        {toast.show && (
          <div
            className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white font-medium transition 
              ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {toast.message}
          </div>
        )}

        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-purple-400 text-sm mb-4"
        >
          <IoChevronBackOutline /> &nbsp; Back
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
          ✨ AI Blog Generator (Streaming)
        </h1>

        {/* Input */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Future of AI in Education"
          className="w-full border rounded-xl p-4 mb-3 resize-none
            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
            border-gray-300 dark:border-gray-600"
          rows="3"
          disabled={loading}
        />

        {error && (
          <p className="text-red-600 dark:text-red-400 mb-3 text-sm">{error}</p>
        )}

        <button
          onClick={() => handleStreamGenerate()}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold mb-4 
            hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "⏳ Streaming..." : "🚀 Start Streaming"}
        </button>

        {/* Live Preview */}
        {blogText && (
          <div
            className="p-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
            rounded-lg mt-4 max-h-[400px] overflow-y-auto"
          >
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
              ✍️ Live Preview:
            </h2>
            <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-100">
              {blogText}
            </pre>

            {!loading && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`mt-4 w-full py-2 rounded-lg text-white font-semibold transition 
                  ${
                    saving
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {saving ? "💾 Saving..." : "✅ Save Blog"}
              </button>
            )}
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && (
          <div className="mt-8">
            <h2 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">
              💡 Try one of these suggestions:
            </h2>
            <div className="flex flex-wrap gap-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleStreamGenerate(s)}
                  disabled={loading}
                  className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 
                    text-sm text-gray-700 dark:text-gray-300 
                    hover:border-blue-500 hover:text-blue-600 dark:hover:text-purple-400 
                    transition disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
