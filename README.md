
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

  ### 2) Run frontend + backend together

  Use:

  - `npm run dev:full`

  This starts:

  - Vite frontend (`http://localhost:5173`)
  - Live backend API (`http://localhost:8787`)

  Vite proxies `/api/*` requests to the backend in development.

  ### 3) API endpoints

  - `GET /api/health`
  - `GET /api/server/status`
  - `GET /api/leaderboard?type=playtime|money&limit=10`
  - `GET /api/live`
  