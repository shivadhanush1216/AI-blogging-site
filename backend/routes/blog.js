// backend/routes/blog.js
const express = require("express");
const Blog = require("../models/Blog");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();
const { CohereClient } = require("cohere-ai");

const router = express.Router();

// Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// ---------- GET all blogs ----------
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// ---------- GET blog by id ----------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid blog id" });
    }
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// ---------- DELETE blog ----------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid blog id" });
    }
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Blog not found" });

    res.json({ success: true, deletedId: id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

// ---------- POST generate (normal full-block) ----------
router.post("/generate", async (req, res) => {
  try {
    let { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: "Prompt required" });
    prompt = prompt.trim();
    if (prompt.length < 5) return res.status(400).json({ error: "Prompt too short" });
    if (prompt.length > 180) return res.status(400).json({ error: "Prompt too long (max 180 chars)" });

    // Generate blog content
    const response = await cohere.chat({
      model: "command-r-08-2024",
      message: `Create a 500-word blog about "${prompt}".
                Return markdown with proper headings (#, ##), bullet points (-), and **bold**.`,
    });
    const content = response.text.trim();

    // Ask Cohere for better Unsplash keywords
    let imageQuery = prompt;
    try {
      const keywordResponse = await cohere.chat({
        model: "command-r-08-2024",
        message: `Give 3-5 keywords for Unsplash images for "${prompt}". 
        Example: AI in healthcare -> AI, robot, doctor, technology`,
      });
      imageQuery = keywordResponse.text.split("\n")[0].trim();
    } catch (_) { }

    // Fetch Unsplash images
    let images = [];
    try {
      const unsplashRes = await axios.get("https://api.unsplash.com/search/photos", {
        params: { query: imageQuery, per_page: 3, orientation: "landscape" },
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_KEY}` },
      });
      images = (unsplashRes.data.results || []).map((img) => img.urls.small);
    } catch (_) { }

    // Save blog
    const blog = new Blog({ title: prompt, content, images });
    await blog.save();
    res.json(blog);
  } catch (e) {
    res.status(500).json({ error: "Failed to generate blog" });
  }
});

// ---------- POST generate-stream (stream like ChatGPT) ----------
router.post("/generate-stream", async (req, res) => {
  let { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: "Prompt required" });
    return;
  }
  prompt = prompt.trim();
  if (prompt.length < 5) {
    res.status(400).json({ error: "Prompt too short" });
    return;
  }
  if (prompt.length > 180) {
    res.status(400).json({ error: "Prompt too long (max 180 chars)" });
    return;
  }

  try {
    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Start streaming
    const stream = await cohere.chatStream({
      model: "command-r-08-2024",
      message: `Live type a 500-word blog about "${prompt}". 
                Use markdown with headings, subheadings, bullet points.`,
    });

    for await (const event of stream) {
      if (event.eventType === "text-generation") {
        res.write(`data: ${event.text}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (e) {
    res.write("data: ERROR: Stream failed\n\n");
    res.end();
  }
});

module.exports = router;  