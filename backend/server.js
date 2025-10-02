// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const blogRoutes = require("./routes/blog");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/blogs", blogRoutes);

// Root route (helpful landing/info)
app.get('/', (req, res) => {
  res.json({
    service: 'AI Blogging API',
    status: 'OK',
    docs: '/health',
    endpoints: ['/api/blogs', '/api/blogs/generate', '/api/blogs/generate-stream'],
    repository: 'https://github.com/shivadhanush1216/AI-blogging-site'
  });
});

// Add a simple health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// 404 fallback (after all routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Connect MongoDB

mongoose.set("debug", true);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📍 Health check: http://localhost:${port}/health`);
      console.log(`📍 API endpoint: http://localhost:${port}/api/blogs`);
    });
  })
  .catch((err) => console.error("❌ Error connecting to MongoDB", err));