# AI Blogging Site

A full‑stack AI powered blogging platform that lets users generate, stream, view, and manage AI‑generated blog posts with images. Built with a Node.js/Express backend, MongoDB database, Cohere AI for text generation, Unsplash for related images, and a modern React + Vite + TailwindCSS frontend.

---

## 🧱 Tech Stack Overview

### Frontend

- React 19 (functional components + hooks)
- Vite (fast dev + build tooling)
- Tailwind CSS 3 (utility-first styling)
- Framer Motion (animations)
- React Router DOM 7 (routing)
- React Markdown / Marked (rendering AI markdown content)
- Lucide / React Icons (UI icons)

### Backend

- Node.js + Express 5
- Mongoose (MongoDB ODM)
- Cohere AI SDK (text + streaming generation)
- Axios (HTTP external API calls, Unsplash)
- Dotenv (environment config)
- CORS (API access from frontend)

### AI & External APIs

| Purpose                 | Provider                            | Notes                                 |
| ----------------------- | ----------------------------------- | ------------------------------------- |
| Blog content generation | Cohere (Model: `command-r-08-2024`) | Normal + streaming endpoints used     |
| Image fetching          | Unsplash API                        | Retrieves 0–3 related images per blog |

### Data Model (Blog)

```
Blog {
  _id: ObjectId,
  title: String,        // user prompt
  content: String,      // generated markdown
  images: [String],     // Unsplash small image URLs
  createdAt: Date
}
```

---

## 🔌 API Endpoints

Base path: `/api/blogs`

| Method | Path               | Description                                       |
| ------ | ------------------ | ------------------------------------------------- |
| GET    | `/`                | List all blogs (desc by createdAt)                |
| GET    | `/:id`             | Fetch single blog by id                           |
| DELETE | `/:id`             | Delete a blog                                     |
| POST   | `/generate`        | Synchronous full blog generation + save           |
| POST   | `/generate-stream` | Server-Sent Events (SSE) streaming live blog text |
| GET    | `/health`          | Health check                                      |

### Streaming Format

`Content-Type: text/event-stream` with incremental `data: <text>` chunks and final `data: [DONE]`.

---

## 📁 Repository Structure

```
backend/
  server.js
  routes/blog.js
  models/Blog.js
frontend/
  src/
    pages/ (Create, Home, BlogDetail, etc.)
    components/ (Navbar)
    hooks/ (useDarkMode)
```

---

## 🔐 Environment Variables

### Backend (`backend/.env` – DO NOT COMMIT)

```
MONGO_URI=your_mongodb_connection_string
COHERE_API_KEY=your_cohere_api_key
UNSPLASH_KEY=your_unsplash_access_key
PORT=5000  # optional for local
```

Sample file: `backend/.env.example`.

### Frontend (`frontend/.env` – DO NOT COMMIT)

```
VITE_API_BASE=http://localhost:5000
```

Sample file: `frontend/.env.example`.

---

## 🧪 Local Development

1. Clone the repo.
2. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
3. Create env files from examples and fill values.
4. Start services (two terminals):
   - Backend: `npm run dev` (in `backend`)
   - Frontend: `npm run dev` (in `frontend`)
5. Open: http://localhost:5173

---

## 🚀 Deployment Guide (Render + Vercel / Netlify)

### 1. Database (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster.
3. Create database user + password.
4. Whitelist IP: 0.0.0.0/0 (for quick start; restrict later).
5. Copy connection string, replace `<user>`, `<password>`, and db name (e.g., `ai_blog`).

### 2. Deploy Backend (Render)

1. Push code to GitHub (monorepo ok).
2. In Render: New → Web Service.
3. Select repo; set Root Directory: `backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variables:
   - `MONGO_URI`
   - `COHERE_API_KEY`
   - `UNSPLASH_KEY`
7. Deploy → wait for build.
8. Test: visit `https://<your-service>.onrender.com/health`.

### 3. Deploy Frontend (Vercel example)

1. New Project → Import same repo.
2. Root Directory: `frontend`.
3. Framework Preset: Vite.
4. Environment Variable: `VITE_API_BASE=https://<your-backend>.onrender.com`
5. Deploy.
6. Open site and test creating a blog.

(Alternative) Netlify:

- Build Command: `npm run build`
- Publish Directory: `dist`
- Env: `VITE_API_BASE=...`

(Alternative) Render Static Site:

- Root: `frontend`
- Build Command: `npm run build`
- Publish Directory: `dist`

### 4. Validate Streaming

In the Create page open DevTools → Network → watch `/generate-stream` chunked data flow (SSE).

---

## 🛡️ Security & Hardening (Next Steps)

- Restrict CORS to your frontend origin.
- Rotate API keys periodically.
- Add rate limiting (e.g., `express-rate-limit`).
- Add validation for prompt length.
- Add auth if multi-user editing required.

---

## 🧩 Future Enhancements

- User accounts & auth (JWT / OAuth)
- Tagging & search
- Draft vs published states
- Markdown editor improvements with preview pane
- Image caching / CDN layer
- Pagination / infinite scroll

---

## 🧪 Simple Health Check

```
GET /health -> { status: "OK" }
```

If failing in production, check:

- Env vars set correctly
- MongoDB reachable
- Cohere quota not exceeded

---

## ❓ Troubleshooting

| Symptom                   | Check                                          |
| ------------------------- | ---------------------------------------------- |
| 404 on refresh (frontend) | Ensure Vercel/Netlify SPA config (automatic)   |
| Mixed content warnings    | Use https API base in production               |
| Streaming stops early     | Network proxy buffering? Retry or inspect logs |
| Blogs not saving          | Mongo URI / DB user auth                       |
| Images missing            | Unsplash key valid & rate limits               |

---

## 📄 License

Specify a license (e.g., MIT) if you plan to open source.

---

## 🙌 Acknowledgements

- Cohere for powerful generation models.
- Unsplash for free high-quality images.
- Vite + React ecosystem contributors.

---

Feel free to open issues or suggest enhancements!
