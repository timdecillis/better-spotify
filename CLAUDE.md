# Orbit.fm

Music playlist generation app that uses the Last.fm API to build intelligent playlists from a seed song/artist. "Temperature" controls how similar vs. diverse the generated tracks are (0 = most similar, 1 = most diverse).

## Tech Stack

- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** for styling
- **Last.fm API** for track/artist data and similarity search
- **Spotify OAuth 2.0 (PKCE)** for authentication
- **OpenAI API** (experimental, server-side only)
- No testing framework configured

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── page.tsx            # Home page entry
│   ├── callback/           # Spotify OAuth callback
│   ├── dashboard/          # Artist search dashboard
│   ├── types/modes.ts      # Song/Mode type definitions
│   ├── lib/open-ai.ts      # OpenAI server function
│   └── api/                # API routes (open-ai, lastfm)
├── components/             # Client components (home, dashboard, spotify-home)
├── lib/
│   ├── last-fm-methods.ts  # Last.fm API wrapper (getSimilarTracks, getTrackInfo, search, etc.)
│   └── mode-handlers/      # Playlist generation algorithms per mode
├── auth/                   # Spotify OAuth (auth, pkce, token, callback)
├── consts/                 # Constants (mode definitions, Last.fm endpoints)
└── utils/utils.ts          # Step size calculation helpers
```

## Commands

- `npm run dev` — Dev server at http://127.0.0.1:3000 (Turbopack)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_LAST_FM_API_KEY` — Last.fm API key
- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` — Spotify OAuth client ID
- `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` — Spotify callback URL
- `OPENAI_API_KEY` — OpenAI API key (server-only)

## Playlist Modes

Five modes control how playlists are built (defined in `src/consts/modes.ts`):
- **Static Orbit** — Each track chosen from seed's similar tracks using temperature-based step size
- **Drifting Orbit** — Each track based on previous track; avoids artist repeats
- **Thermal Ascent** — Not yet implemented
- **Thermal Drift** — Not yet implemented
- **Twin Gravity** — Not yet implemented

Default playlist length: 10 songs (configurable in `src/consts/modes.ts`).

## Key Patterns

- Client components use `"use client"` directive; state via React hooks + localStorage for tokens
- Path alias: `@/*` maps to `./src/*`
- Files: camelCase for logic files, components named by purpose
- Types: `Song` and `Mode` defined in `src/app/types/modes.ts`
- Last.fm API calls use query params with API key (no auth headers)
- Temperature maps to step sizes via functions in `src/utils/utils.ts`

## Data Flow

1. User enters artist + song name, selects mode and temperature
2. Mode handler in `src/lib/mode-handlers/` calls Last.fm methods
3. Algorithm assembles playlist based on similarity data and temperature
4. Results displayed in the home component UI
