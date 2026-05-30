
  # Craft SMP Website UI Design

  This is a code bundle for Craft SMP Website UI Design. The original project is available at https://www.figma.com/design/q6ZIaqb49upmgu1xJ11orm/Craft-SMP-Website-UI-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Live Minecraft Integration

  This project now includes a backend live API service for:

  - realtime Minecraft server status (online/max players, status, player list)
  - realtime leaderboard data from MySQL/MariaDB
  - EssentialsX money leaderboard support (query-configurable)
  - Plan playtime leaderboard support (query-configurable)

  ### 1) Configure environment

  Copy `.env.example` to `.env` and set:

  - Minecraft host/port
  - MySQL credentials
  - leaderboard SQL queries for money and playtime

  If you deploy the frontend on Vercel, also set `VITE_API_BASE_URL` to the public URL of the backend API, for example `https://your-api.example.com`.

  ### 2) Run frontend + backend together

  Use:

  - `npm run dev:full`

  This starts:

  - Vite frontend (`http://localhost:5173`)
  - Live backend API (`http://localhost:8787`)

  Vite proxies `/api/*` requests to the backend in development.

  For production, the frontend must call a reachable backend API. If the site is hosted on Vercel, do not rely on the local Express server path; use `VITE_API_BASE_URL` to point to your deployed backend.

  ### 3) API endpoints

  - `GET /api/health`
  - `GET /api/server/status`
  - `GET /api/leaderboard?type=playtime|money&limit=10`
  - `GET /api/live`
  