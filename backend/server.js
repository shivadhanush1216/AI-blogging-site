// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const blogRoutes = require("./routes/blog");

const app = express();

// ----- Security & Core Middleware -----
// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Dynamic CORS based on env ALLOWED_ORIGINS
const rawOrigins = process.env.ALLOWED_ORIGINS || "*";
let allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);
if (allowedOrigins.length === 1 && allowedOrigins[0] === '*') {
  allowedOrigins = []; // treat as open
}
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS blocked for origin: ' + origin));
  }
}));

app.use(express.json({ limit: '1mb' }));

// Rate limiter for generation endpoints
const genLimiter = rateLimit({
  windowMs: (parseInt(process.env.GEN_WINDOW_MINUTES || '15', 10)) * 60 * 1000,
  max: parseInt(process.env.GEN_MAX_REQUESTS || '10', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded. Try again later.' }
});

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
// Attach limiter only to expensive AI routes via mount path filtering
app.use((req, res, next) => {
  if (req.path.startsWith('/api/blogs/generate')) {
    return genLimiter(req, res, next);
  }
  next();
});

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
if (process.env.NODE_ENV === 'production') {
  mongoose.set('debug', false);
} else {
  mongoose.set('debug', true);
}


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