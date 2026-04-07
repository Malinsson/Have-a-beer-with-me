# Have a Beer With Me

Interactive event web app where users create a personalized digital beer can, publish it to their profile, and collect other users' cans in a shelf by scanning QR codes.

## Project Goals

- Let users design a front and back can label with text, image, and personal details
- Generate profile-linked QR codes so other users can discover each other at an event
- Support guest onboarding and full account signup/login
- Save and share can designs through Supabase
- Save discovered cans into a personal shelf experience

## Main Features

- Onboarding flow with guest session bootstrap
- Auth flow (signup/login/logout)
- Multi-step can designer:
  - front label text + style controls
  - image upload + crop
  - image position/zoom on can
  - back label with description, tags, and socials
- Live can preview
- Auto-save draft behavior while designing
- Profile page with can preview, QR code, and social links
- Public can detail pages by share id
- Shelf feature for collecting saved cans
- QR scanner interactions for quick navigation

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Zustand for designer state
- Supabase (Auth + Postgres)
- Tailwind CSS 4 (with custom color tokens)
- React Three Fiber / Drei for 3D-related UI pieces
- Vercel Blob upload API route for image hosting

## Architecture Summary

### Frontend

- App entry mounts BrowserRouter and routes through a shared layout
- Pages in src/pages handle route-level flows
- Feature modules in src/features keep auth, profile, and designer logic grouped
- Global design state lives in a Zustand store

### Backend Services

- Supabase Auth for user and guest sessions
- Supabase Postgres for profiles, designs, and saved designs
- Vercel serverless function for secure image upload to Blob storage

### Data Model (high level)

- profiles: user profile identity and slug
- designs: canonical can design payload + share id
- saved_designs: user-to-shared-can relation (shelf)

## User Flow

1. User lands on home page and starts intro
2. App ensures a guest session exists
3. User enters name/profile starter info
4. User customizes can in designer steps
5. Drafts auto-save, final design is persisted
6. User can create/sign in to keep the can tied to account
7. Profile and can pages become shareable via slug/share id
8. Other users scan/save cans into their shelf

## Project Structure

```text
.
|- api/                    # Vercel serverless endpoints
|- public/                 # static assets
|- src/
|  |- assets/              # images, carousel, 3D models
|  |- components/          # reusable UI components
|  |- features/
|  |  |- Auth/             # auth forms + hooks
|  |  |- can-designer/     # design step flow, upload, preview
|  |  |- profile/          # profile data hooks
|  |- lib/                 # shared clients (Supabase)
|  |- pages/               # route pages
|  |- shared/              # shared hooks/components
|  |- store/               # Zustand state store
|- supabase/
|  |- migrations/          # SQL migrations
|  |- schemas/             # schema snapshots
|  |- seed.sql             # optional seed data
```

## Environment Variables

Create a .env file in the project root.

```bash
# Primary Supabase variables
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Optional fallback names supported by this app
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SYSTEMBOLAGET_VITE_PUBLIC_SUPABASE_URL=
SYSTEMBOLAGET_VITE_PUBLIC_SUPABASE_ANON_KEY=
SYSTEMBOLAGET_VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Required in Vercel/server env for upload API
BLOB_READ_WRITE_TOKEN=
```

Notes:

- The app supports both VITE_* and SYSTEMBOLAGET_VITE_PUBLIC_* prefixes.
- If Supabase values are missing, the app logs a configuration error and client operations fail.
- Camera/QR features require HTTPS in production.

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+
- Supabase CLI (for local DB workflow)

### Install

```bash
npm install
```

### Run the frontend

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Supabase Workflow

This repository already contains SQL migrations and schema snapshots.

Typical flow:

```bash
# Link your project once
npx supabase link --project-ref <your-project-ref>

# Push local migrations to remote
npx supabase db push
```

Optional local-first flow:

```bash
npx supabase start
npx supabase db reset
```

## Deployment

### Frontend

- Deploy with Vercel (recommended for this repo setup)
- Build command: npm run build
- Output directory: dist

### API route

- api/vercelBLOB.js handles multipart image uploads
- Requires BLOB_READ_WRITE_TOKEN in deployment environment
- Accepts png, jpg/jpeg, webp, gif (max 10 MB)

### Required production envs

- Supabase URL + anon key
- BLOB_READ_WRITE_TOKEN

## Key Implementation Notes

- Designer state is merged and persisted with share id reuse logic
- Saved shelf entries are unique per (user_id, share_id)
- Cache invalidation is used for profile and saved design freshness
- Guest and authenticated auth states are both supported in flows

## Troubleshooting

### Blank data or auth errors

- Verify Supabase env vars are present and correct
- Confirm the Supabase project has all migrations applied

### Upload fails

- Check BLOB_READ_WRITE_TOKEN in deployment env
- Confirm file type is allowed and under 10 MB

### QR scan issues in production

- Ensure app is served over HTTPS
- Confirm browser camera permissions are granted

### Save-to-shelf does not update UI

- Ensure save actions go through the same state-updating handler
- Confirm unique index on saved_designs(user_id, share_id) exists

## Scripts

- npm run dev: start Vite dev server
- npm run build: create production bundle
- npm run preview: serve built output locally
- npm run lint: run ESLint

## License

See LICENSE for licensing information.
