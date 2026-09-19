# TnG Tracker

A mobile-first transit card tracker. Reload your balance, log every MRT, LRT, KTM and bus journey, and browse journeys filed into folders by trip name.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS and Lucide icons.

## Features

- **Current Balance** shown on a transit-card style header, recalculated instantly from the transaction ledger.
- **Reload** sheet with quick amounts (RM 10 / 20 / 50 / 100).
- **Add Journey** sheet: trip name (with suggestions from existing trips), origin, destination, time, fare, and mode (MRT / LRT / KTM / Bus). Fares larger than the balance are blocked.
- **Trip Logs** page: a grid of folders, one per trip name. Tap a folder to see every journey inside it.
- Delete any transaction and the balance recalculates.
- State lives in React Context (`useReducer`) and is mirrored to `localStorage` so data survives a refresh.

## Project structure

```
app/
  layout.tsx          Root layout, WalletProvider, bottom tab bar
  page.tsx            Dashboard (balance, actions, recent activity)
  logs/page.tsx       Trip Logs folder grid
  globals.css
context/
  WalletContext.tsx   Ledger state, derived balance and trip groups
components/
  BalanceCard.tsx     Current balance header
  ReloadSheet.tsx     Reload form
  JourneySheet.tsx    Add journey form
  ModePicker.tsx      Transit mode pills
  RecentActivity.tsx  Latest transactions
  TripFolderGrid.tsx  Folder icons
  TripFolderSheet.tsx Journeys inside a folder
  Sheet.tsx           Bottom sheet / modal
  BottomNav.tsx, Field.tsx, ModeBadge.tsx
lib/
  types.ts, format.ts, transit.ts
.github/workflows/deploy.yml   Auto-deploy to GitHub Pages
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Deploy

**GitHub Pages:** every push to `main` builds and deploys automatically. In the repo go to **Settings → Pages → Source** and choose **GitHub Actions** once. The site will be at `https://<username>.github.io/<repo-name>/`.

If the repo is named `<username>.github.io`, set `NEXT_PUBLIC_BASE_PATH` to an empty string in `.github/workflows/deploy.yml`.

**Any static host (e.g. InfinityFree):** run `npm run build` and upload the contents of `out/`.
