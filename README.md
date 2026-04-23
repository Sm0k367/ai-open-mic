# AI Open Mic

**A bold, sleek, real-time interactive web platform for AI-powered open mic events.**

Live guest queue with host controls, animated audience reactions that fly across the stage, rotating showcase carousel, minimal chat, and a unified neon cyberpunk design system. Built as a production-grade skeleton using React, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion. Fully responsive, accessible, and ready for Vercel deployment with easy extension to real WebSockets, authentication, and database.

![AI Open Mic Screenshot](https://via.placeholder.com/800x600/0a0a0a/00f0ff?text=AI+Open+Mic+Live+Stage) 

## Features

- **Live Guest Queue**: Real-time list of waiting guests with approve, promote-to-stage, mute, and drop controls. Current speaker is highlighted with neon glow.
- **Audience Reactions**: Instant emoji reactions (🔥, 👏, 🤖, 🌟, ❤️) with live counters. Reactions animate and fly across the main stage in real-time using Framer Motion.
- **Showcase Carousel**: Rotating cards featuring past performances, AI projects, and creators with smooth hover effects and links.
- **Immersive Stage**: Central performance area with large animated microphone, performer details, and live reaction overlay.
- **Live Chat**: Simple real-time chat simulation (easily upgraded to Socket.io).
- **Host vs Audience Modes**: Toggleable views with appropriate controls.
- **Professional Polish**: Neon glows, smooth animations, live viewer counter, pulsing indicators, keyboard support, test IDs for QA.
- **Mock Data Ready for Production**: All state is in React — swap for TanStack Query + backend API, Drizzle ORM, or Supabase in seconds.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v3, shadcn/ui, Framer Motion, Lucide icons, Wouter (hash routing for iframe/Vercel compatibility).
- **Design System**: Custom neon cyberpunk palette (electric cyan primary, magenta accents) built on the Kortix/website-building design tokens. Elevation, motion, and taste principles followed.
- **State & Real-time**: React state + setInterval simulation. Template includes TanStack Query and Express backend stubs for full real-time (WebSockets/SSE).
- **Deployment**: Vercel (static export with hash routing — zero config needed).

## Local Development

```bash
cd ai-open-mic
npm install
npm run dev
```

Open http://localhost:5173 (or the port shown). All interactions are fully functional.

## Vercel Deployment (One-Click Ready)

1. Push this repo to GitHub (already done).
2. Import the repo in [Vercel](https://vercel.com/new).
3. Vercel will auto-detect Vite:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
4. Deploy. The app uses hash-based routing so SPA navigation works perfectly on static hosting.

See `vercel.json` for explicit rewrites if needed. Environment variables can be added for API keys (e.g. for real LLM integrations or auth).

## Architecture

- `client/src/App.tsx`: Main interactive component with all features (queue state, reaction system with flying animations, showcase, chat).
- `client/src/index.css`: Unified design tokens, neon effects, animations, and Tailwind layers.
- `tailwind.config.ts`: Extended theme with custom colors, keyframes for accordion/reactions, typography plugin.
- `server/`: Ready for Express API, storage, and real-time (Drizzle ORM included in template).
- `shared/schema.ts`: Zod/Drizzle schemas for future data models (Guest, Reaction, Performance).

**Real-time Extension Path**:
1. Add Socket.io or Supabase Realtime to `server/index.ts`.
2. Update frontend queries/mutations to listen to events.
3. Deploy backend as Vercel Serverless Functions or separate service.

## Roadmap

- Full WebSocket real-time sync (queue, reactions, chat).
- Guest authentication (simple email or OAuth).
- Persistent storage (Drizzle + Postgres on Vercel).
- Recording/performance archive page.
- AI judge/feedback integration.
- Mobile PWA with offline queue.

## Contributing

See `CONTRIBUTING.md`. PRs welcome for new reaction effects, better animations, or backend integration.

## License

MIT © 2026 Sm0k367 & Kortix AI. See `LICENSE`.

---

**Built with the Kortix website-building skill for distinctive, scalable, production-grade experiences.**

Made for high-energy AI creative events. Launch it, iterate fast, make it your own.
