// frontend/src/config.js
// Derive API base from Vite env var (configured at build time) with a sensible fallback for local dev.
// You can set this in a .env file as VITE_API_BASE or pass as a build arg in Docker.
// Example .env (frontend/.env):
//   VITE_API_BASE=http://localhost:5000
const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:5000";
export default API_BASE;