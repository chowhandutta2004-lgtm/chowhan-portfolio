# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start the Express server (port 3000 or 5000)
npm run dev      # Same as start
```

No build step — frontend is served as static files directly by Express.

## Environment Variables

Requires a `.env` file with:
- `PORT` — server port (defaults to 5000)
- `EMAIL_USER` / `EMAIL_PASS` — Gmail credentials for contact form
- `HF_API_KEY` — Hugging Face API key for the AI chatbot

## Architecture

Single-page portfolio served by an Express backend. The backend serves `frontend/` as static files and exposes three API routes:

- `POST /api/chat` — AI chatbot via Hugging Face (Llama 3.1-8B-Instruct), `backend/routes/chat.js`
- `POST /api/contact` — Contact form emails via Nodemailer/Gmail, `backend/routes/contact.js`
- `GET /api/visitors` — In-memory visitor counter (resets on restart), `backend/routes/visitors.js`

**Frontend** is a single HTML page (`frontend/index.html`) with vanilla JS (`frontend/script.js`, `frontend/ghost-cursor.js`) and CSS (`frontend/style.css`). Project data is hardcoded in `script.js`. Animations use GSAP 3.12.5 + ScrollTrigger (loaded via CDN) and Intersection Observer for `.reveal` elements. Ghost cursor uses Three.js r128 + post-processing via CDN.

**Frontend assets:**
- `frontend/image.jpg` — hero background photo
- `frontend/img.png-removebg-preview.png` — about section photo (removed background)
- `frontend/ocr-cnn-gan.mp4` — demo video for OCR project
- `frontend/rags-ai.mp4` — demo video for RAGs AI project
- `frontend/slm-benchmark.mp4` — demo video for SLM Benchmark project
- `frontend/x ray.mp4` — demo video for X-Ray Vision project
- `frontend/ai weapon.mp4` — demo video for Weapon Detection project
- `frontend/chowhandutta resume.pdf` — resume PDF (opens in new tab from nav)

**Sections:** Hero → Marquee → About → Projects → Tech Stack → Contact → Footer. Floating chatbot widget is always visible.

**UI features:**
- Ghost cursor effect (`frontend/ghost-cursor.js`) — Three.js WebGL smoky trail that follows the mouse, purple (`#B19EEF`), `mix-blend-mode: screen`, disabled on mobile/touch. Replaces the old dot+follower cursor. Three.js r128 + post-processing loaded via CDN.
- Full-screen loader animation (GSAP, spells out "CHOWHAN DUTTA")
- Marquee ticker strip between Hero and About
- 3D card tilt on project flashcards (mouse-driven perspective transform)
- Drag-to-scroll on projects grid
- Floating "CONNECT" button that hides on scroll down
- Hamburger menu + full-screen mobile nav overlay (768px and below)
- Lazy-loaded project videos (only load when scrolled into view)
- Resume button in nav bar (opens PDF in new tab)

**Design system:** Dark theme — backgrounds `#0a0a0a`/`#111111`, accent `#e63946` (dark red). Fonts: 'Bebas Neue' (display), 'Playfair Display' (italic hero title), 'Inter' (body).

**Projects (hardcoded in `script.js`):**
1. Real-Time Weapon Detection — YOLOv11 — Python, FastAPI, YOLOv11, OpenCV, ONNX, WebSocket, Docker
2. Advanced OCR System with CNN and GAN — Python, TensorFlow, Keras, OpenCV, GAN, NumPy
3. RAGs AI — Chat With Your Documents — React, FastAPI, GPT-4o, ChromaDB, LangChain, Firebase, Tailwind
4. Local SLM Benchmark — Test Your Own Models — Python, FastAPI, Ollama, Pydantic, JavaScript, HTML/CSS
5. X-Ray Vision — Real-Time Webcam X-Ray Effect — Next.js, React, TypeScript, MediaPipe, Canvas API

**Tech stack sections in HTML:** Intelligence Layer (incl. Ollama, Ultralytics), Neural Craft (incl. MediaPipe, ONNX), Build Engine (incl. Next.js, TypeScript, Pydantic), Command Center (incl. Docker) — icons loaded from `cdn.jsdelivr.net/gh/devicons/devicon` and `simple-icons`.

**Performance:** All demo videos are compressed (total ~4 MB) and lazy-loaded. Hero image compressed. No-cache headers set for HTML/CSS/JS to prevent stale content. Keep video files small to stay within Vercel's 10 GB/month Fast Origin Transfer limit.

**Deployment:** Vercel — `vercel.json` routes all requests through `backend/server.js` with no-cache headers.

**Dependencies:** `express`, `cors`, `dotenv`, `nodemailer` (no npm AI SDK — HF API called via fetch in `chat.js`). **CDN libs:** GSAP 3.12.5, Three.js r128 + post-processing (EffectComposer, RenderPass, ShaderPass, UnrealBloomPass).
