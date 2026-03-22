<div align="center">

<br />

```
  ╭──────────────────────────────╮
  │  🍽️  claude · e a t s       │
  ╰──────────────────────────────╯
```

### *A self-hosted weekly dinner planner powered by Claude AI*

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-E5A23C?style=flat-square)](https://anthropic.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-5E9B5E?style=flat-square)](LICENSE)

<br />

> **claude·eats** generates a full week of family dinners, a Sunday batch-cooking prep guide,
> and an interactive grocery checklist — all from a single click.
> Your data lives on your server. You bring your own API key.

<br />

[**Quick Start**](#-quick-start) · [**Features**](#-features) · [**Self-Hosting**](#-self-hosting) · [**Development**](#-development) · [**Support**](#-support)

<br />

</div>

---

## ✨ Features

| | |
|---|---|
| 🤖 **AI-generated plans** | Claude picks dinners your family will actually eat, avoiding what you hate and favouring what you love |
| 🔒 **Fully self-hosted** | Your meal data, preferences, and API key never leave your own server |
| 👍 **Like / dislike** | Rate any meal — Claude learns your taste over time and weights future suggestions accordingly |
| 📅 **Configurable days** | Choose which days you want planned — not everyone cooks Monday through Friday |
| 🔁 **Per-day swap** | Regenerate a single day's meal without touching the rest of the week |
| 🔒 **Lock days** | Lock a meal so it survives a full-week regeneration |
| 🛒 **Smart grocery list** | Ingredients auto-aggregate across all meals, scaled to your serving count, grouped by aisle |
| 📦 **Sunday prep guide** | Vacuum-sealer-aware batch cooking steps generated alongside each plan |
| 📄 **DOCX exports** | Download the shopping list or prep guide as a Word document |
| ⏱️ **Auto-planning** | Optional Saturday cron job generates next week's plan automatically |
| 🧅 **Preferences** | Block ingredients you hate, flag ones you love — persisted across every generation |
| 🍽️ **Meal history** | Browse every week you've planned, complete with ratings |

---

## 🚀 Quick Start

**You need:** Docker + Docker Compose, and an [Anthropic API key](https://console.anthropic.com/).

```bash
# 1. Clone
git clone https://github.com/boilerrat/claude-eats.git
cd claude-eats

# 2. Generate a session secret
echo "APP_SECRET=$(openssl rand -hex 32)" > .env

# 3. Start
docker compose up -d

# 4. Open http://localhost:3000
#    The app redirects you to /setup on first run
```

On first visit you'll see the **Setup Wizard** — set a password and paste your Anthropic API key. Everything else is configured through the UI.

---

## 🐳 Self-Hosting

### docker-compose.yml

```yaml
services:
  app:
    image: ghcr.io/boilerrat/claude-eats:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      APP_SECRET: ${APP_SECRET}
      DATABASE_URL: file:/data/db.sqlite
    volumes:
      - claude-eats-data:/data

volumes:
  claude-eats-data:
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `APP_SECRET` | **Yes** | Random secret for session signing — `openssl rand -hex 32` |
| `DATABASE_URL` | Auto | Set to `file:/data/db.sqlite` in production; defaults to `file:./dev.db` in dev |
| `CRON_SECRET` | No | If set, the `/api/cron/weekly` endpoint requires `Authorization: Bearer <secret>` |

> **The Anthropic API key is entered through the web UI on first run and stored in the database — not in environment variables.**

### Updating

```bash
docker compose pull && docker compose up -d
```

Database migrations run automatically on every startup — your data is safe.

### Deploying to a VPS (Dokploy / Coolify / Caprover)

1. Set `APP_SECRET` in your platform's environment variable UI
2. Mount a persistent volume at `/data`
3. Map port `3000` (or put it behind a reverse proxy)
4. Deploy — on first visit, complete the setup wizard

---

## 🛠️ Development

```bash
npm install
cp .env.example .env          # Add APP_SECRET
npx prisma migrate dev        # Initialise local database
npm run dev                   # http://localhost:3000
```

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run typecheck` | Type-check without emitting |
| `npx prisma migrate dev --name <name>` | Create a new migration |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma studio` | Browse and edit the database in your browser |

### Project Structure

```
src/
├── app/
│   ├── layout.tsx                  Root layout + nav
│   ├── page.tsx                    Weekly plan (main view)
│   ├── shopping/page.tsx           Interactive grocery checklist
│   ├── prep/page.tsx               Sunday prep guide
│   ├── preferences/page.tsx        Blocked/preferred ingredients
│   ├── history/page.tsx            Past weeks + ratings
│   ├── settings/page.tsx           API key, days, password
│   ├── meals/[id]/page.tsx         Meal detail — recipe + prep
│   └── api/                        All API routes
├── components/                     Client components
└── lib/                            DB, auth, Claude integration
```

### Adding Features

- **New page** — create `src/app/<route>/page.tsx` and add it to the nav in `src/components/NavBar.tsx`
- **New API route** — add `src/app/api/<route>/route.ts`
- **Schema change** — edit `prisma/schema.prisma` → `npx prisma migrate dev --name <name>` → `npx prisma generate`

---

## 🗺️ Roadmap

- [ ] Pantry stock tracking — skip items you already have
- [ ] Per-meal calorie / macro estimates
- [ ] Aisle-ordered shopping list (configurable store layout)
- [ ] PDF export option
- [ ] Multiple family profiles

---

## 💛 Support

`claude·eats` is free and open-source. If it saves you time every Sunday, consider buying me a coffee — it helps keep the project alive.

<div align="center">

<br />

<a href="https://buymeacoffee.com/boilerhaus" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>

&nbsp;&nbsp;&nbsp;

<a href="https://etherscan.io/address/0xa2216234014166BCf0B64E6D7363bBAC9Da2b75f" target="_blank">
  <img src="https://img.shields.io/badge/Send%20ETH%20(any%20EVM%20chain)-627EEA?style=for-the-badge&logo=ethereum&logoColor=white" alt="Send ETH" style="height: 60px !important;" >
</a>

<br /><br />

```
0xa2216234014166BCf0B64E6D7363bBAC9Da2b75f
```
*(Ethereum · Base · Arbitrum · Optimism · Polygon · any EVM network)*

<br />

</div>

---

## 📄 License

MIT — fork it, self-host it, improve it. If you build something cool on top, a mention is always appreciated.
