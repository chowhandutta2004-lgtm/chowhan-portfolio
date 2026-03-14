# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start the Express server (port 3000)
npm run dev      # Same as start
```

No build step — frontend is served as static files directly by Express.

## Environment Variables

Requires a `.env` file with:
- `PORT` — server port (3000)
- `EMAIL_USER` / `EMAIL_PASS` — Gmail credentials for contact form
- `HF_API_KEY` — Hugging Face API key for the AI chatbot

## Architecture

Single-page portfolio served by an Express backend. The backend serves `frontend/` as static files and exposes three API routes:

- `POST /api/chat` — AI chatbot via Hugging Face (Llama 3.1-8B-Instruct), `backend/routes/chat.js`
- `POST /api/contact` — Contact form emails via Nodemailer/Gmail, `backend/routes/contact.js`
- `GET /api/visitors` — In-memory visitor counter (resets on restart), `backend/routes/visitors.js`

**Frontend** is a single HTML page (`frontend/index.html`) with vanilla JS (`frontend/script.js`) and CSS (`frontend/style.css`). Project data (projects list) is hardcoded in `script.js`. Scroll animations use Intersection Observer.

**Design system:** Dark theme — backgrounds `#0a0a0a`/`#111111`, accent `#e63946` (dark red). Headers use 'Bebas Neue', body uses 'Inter'.

**Deployment:** Vercel — `vercel.json` routes all requests through `backend/server.js`.
