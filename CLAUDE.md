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

**Frontend** is a single HTML page (`frontend/index.html`) with vanilla JS (`frontend/script.js`) and CSS (`frontend/style.css`). Project data is hardcoded in `script.js`. Animations use GSAP 3.12.5 + ScrollTrigger (loaded via CDN) and Intersection Observer for `.reveal` elements.

**Frontend assets:**
- `frontend/image.jpg` — hero background photo
- `frontend/img.png-removebg-preview.png` — about section photo (removed background)
- `frontend/ocr-cnn-gan.mp4` — demo video for OCR project
- `frontend/rags-ai.mp4` — demo video for RAGs AI project
- `frontend/slm-benchmark.mp4` — demo video for SLM Benchmark project

**Sections:** Hero → Marquee → About → Projects → Tech Stack → Contact → Footer. Floating chatbot widget is always visible.

**UI features:**
- Custom cursor (`.cursor` + `.cursor-follower`)
- Full-screen loader animation (GSAP, spells out "CHOWHAN DUTTA")
- Marquee ticker strip between Hero and About
- 3D card tilt on project flashcards (mouse-driven perspective transform)
- Drag-to-scroll on projects grid
- Floating "CONNECT" button that hides on scroll down

**Design system:** Dark theme — backgrounds `#0a0a0a`/`#111111`, accent `#e63946` (dark red). Fonts: 'Bebas Neue' (display), 'Playfair Display' (italic hero title), 'Inter' (body).

**Projects (hardcoded in `script.js`):**
1. Advanced OCR System with CNN and GAN — Python, TensorFlow, Keras, OpenCV, GAN, NumPy
2. RAGs AI — Chat With Your Documents — React, FastAPI, GPT-4o, ChromaDB, LangChain, Firebase, Tailwind
3. Local SLM Benchmark — Test Your Own Models — Python, FastAPI, Ollama, Pydantic, JavaScript, HTML/CSS
4. X-Ray Vision — Real-Time Webcam X-Ray Effect — Next.js, React, TypeScript, MediaPipe, Canvas API

**Tech stack sections in HTML:** Intelligence Layer (incl. Ollama), Neural Craft (incl. MediaPipe), Build Engine (incl. Next.js, TypeScript, Pydantic), Command Center — icons loaded from `cdn.jsdelivr.net/gh/devicons/devicon` and `simple-icons`.

**Deployment:** Vercel — `vercel.json` routes all requests through `backend/server.js`.

**Dependencies:** `express`, `cors`, `dotenv`, `nodemailer` (no npm AI SDK — HF API called via fetch in `chat.js`).
