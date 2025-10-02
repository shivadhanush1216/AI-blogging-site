// // backend/models/Blog.js
// const mongoose = require("mongoose");

// const BlogSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   images: [{ type: String }],
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Blog", BlogSchema);  

const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Blog", BlogSchema);