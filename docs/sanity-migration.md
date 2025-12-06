# Sanity Migration Plan — Lewis & Clark College Reading Series Archive

This document outlines a practical, incremental plan for moving the Reading Series archive from local JSON data to Sanity as a headless CMS, while keeping the existing Astro front‑end and Vercel deployment.

The goal: non‑technical admins can manage content in Sanity Studio (writers, years, media links) while the public site remains a fast, static Astro build.

---

## 1. High‑Level Architecture

- **Front‑end**: Astro (this repo), deployed on Vercel.
- **CMS**: Sanity project + Studio (separate folder or repo), hosted by Sanity.
- **Data flow**:
  - Astro **static builds** fetch content from Sanity at build time using a read‑only token.
  - Sanity Studio is used only by authenticated admins to edit content.
  - Media (audio/video) is hosted either:
    - on an L&C media server (preferred), or
    - on approved third‑party hosts (YouTube, Vimeo, etc.).
  - Sanity stores metadata + URLs to these media assets.

Rebuild strategy:

- The archive is small and updates will be relatively infrequent, so we will keep deployment simple:
  - Configure a **Vercel deploy webhook**.
  - In Sanity, add a webhook that calls Vercel on publish/unpublish.
  - Each content change triggers a full static rebuild of the site.
- No incremental/ISR or SSR is required unless future requirements change.

We will **mirror the existing data API** (`getWriterById`, `getWritersByYear`, `getAllYears`, `getWritersByGenre`, `getAllGenres`) so that page components need minimal changes.

---

## 2. Sanity Project & Studio Setup

**Steps**

1. Install the Sanity CLI in this project:
   - `npm install --save-dev sanity`
2. Scaffold a Studio (either in this repo or a sibling repo):
   - Option A (inside this repo): `npx sanity init --project <new-project-id> --dataset production --template clean` into `./sanity/`.
   - Option B (recommended for long term): create a separate `lcc-reading-series-cms` repo and run `npx sanity init` there.
3. In Sanity manage:
   - Create a **project** (if not created during init).
   - Create a **dataset** (`production`).
   - Add admin/editor users (yourself, key staff).
4. Configure environment variables in Vercel for this Astro app:
   - `SANITY_PROJECT_ID`
   - `SANITY_DATASET` (e.g. `production`)
   - `SANITY_API_VERSION` (e.g. `2025-01-01`)
   - `SANITY_READ_TOKEN` (project token with read access only).

We do **not** embed Studio into the Astro app for now; editors reach it at `https://<your-project>.sanity.studio`.

---

## 3. Content Model Design

We will start with a minimal but future‑proof model that aligns with the current JSON (`src/data/writers.json`) and anticipated needs (audio/video, more metadata).

### 3.1 Writer Document

Sanity type: `writer`

Key design principles:

- Keep a **single display name** for rendering.
- Add **structured name fields** for sorting.
- Preserve years, genres, works, awards, and links as in the current JSON.

Fields:

- `displayName` (string, required)
  - The name as it should appear on the site (e.g., `"Ada Limón"`, `"J. Hillis Miller"`, `"Major Jackson"`).
- `lastName` (string, required)
  - Used for alphabetical sorting.
  - For writers with a single name, store that here as well.
- `firstNames` (string, optional)
  - Everything before the last name (e.g., `"Ada"`, `"J. Hillis"`, `"Major"`).
  - Supports initials, multiple given names, or being left blank.
- `slug` (slug, required, unique)
  - Backed by `id` in the current JSON (e.g., `"ondaatje-michael"`).
  - In the schema, configure the slug field **not** to auto‑generate from `displayName` (no `source` or a custom slugify that preserves imported values) so editing a name does not change URLs.
- `years` (array of numbers, required)
  - Matches current usage: appearance years, e.g. `[2017]`.
  - Keep this simple initially; a separate “event” model can be added later if needed.
- `genres` (array of strings, required)
  - Normalized form of the current JSON `genre` field.
  - During import, split `genre` on `/`, trim each part, and store as an array (e.g., `"fiction/poetry"` → `["fiction", "poetry"]`).
  - This gives us a clean basis for faceted filtering from day one.
- `bio` (text, required)
  - Existing bios can be imported directly.
- `notableWorks` (array of strings)
  - Titles only; we can later expand to a more structured “Work” type if needed.
- `awards` (array of strings)
  - As in the JSON.
- `wikipediaUrl` (url, optional)
- `officialWebsite` (url, optional)
- `photo` (object, optional)
  - Strategy options:
    - Phase 1: keep **local WebP images** in `public/images/writers` and store only metadata/paths in Sanity:
      - `localPath` (string, e.g. `"writers/ondaatje-michael.webp"`)
      - `attribution` (string)
      - `license` (string)
      - `notes` (text)
    - Phase 2 (optional): use `image` type in Sanity for storage + CDN delivery.
- `media` (object, optional) — for audio/video:
  - `audioClips` (array of objects)
    - `title` (string)
    - `description` (text, optional)
    - `url` (url, required — L&C media server, podcast host, or a “video with still image” on YouTube/Vimeo).
  - `videoClips` (array of objects)
    - `title` (string)
    - `description` (text, optional)
    - `url` (url, required — L&C media server, YouTube, Vimeo, Panopto, etc.).

**Alphabetical sorting by last name**

In GROQ, we can sort by `lastName` then `firstNames`, e.g.:

```groq
*[_type == "writer"] | order(lastName asc, firstNames asc)
```

This allows:

- Required `lastName` for predictable sorting.
- Optional `firstNames` (including initials) for tie‑breaking while respecting preferred forms.
- Mononyms (single names) to work by duplicating the name into `lastName` and `displayName`.

### 3.2 Supporting Types (optional, phase 2+)

We can keep the model simple for the initial migration and add more structure later:

- `appearance` / `event` document:
  - Fields: `writer` (reference), `year`, `date`, `seriesName`, `venue`, `notes`, `media` references.
  - This would allow multiple events per writer with richer detail.
- `genre` document:
  - For a controlled vocabulary and improved filtering.

To minimize risk, phase 1 will **not** require these; we keep `years` and `genre` on the `writer` document as today.

---

## 4. Data Migration Strategy

We will use the Sanity CLI and a small script to import from `src/data/writers.json` into Sanity.

**Steps**

1. Export writers from the JSON into Sanity’s import format:
   - Add a Node/TS script (e.g., `scripts/export-to-sanity.ts`) that:
     - Reads `src/data/writers.json`.
     - Maps each writer to a Sanity document:
       - `_type: "writer"`
       - `_id: "writer.<id>"` (e.g., `"writer.ondaatje-michael"`)
       - `displayName` from `name`
       - `lastName` / `firstNames` from a **safe splitter**:
         - Default: last word = `lastName`, rest = `firstNames`.
         - Provide a manual override table for tricky cases (initials, multi‑word surnames).
        - `genres` from `genre` by splitting on `/` and trimming each entry.
       - All other fields mapped 1:1.
2. Dry‑run the import in a separate dataset (e.g. `dev`):
   - `npx sanity dataset create dev`
   - `npx sanity import tmp/writers.ndjson <project-id>/dev`
3. Check data in Sanity Studio:
   - Spot‑check a handful of writers (particularly edge cases) for:
     - Correct display name.
     - Correct last name and first names.
     - Years, genres, bios, and links match the original JSON.
4. Once satisfied, import into `production`:
   - `npx sanity import tmp/writers.ndjson <project-id>/production`
   - Or re‑run the import script targeting `production` after any tweaks.

The existing JSON file can remain in the repo for historical reference until the Sanity integration is fully proven, then be deprecated.

---

## 5. Astro Integration: Data Layer

Goal: keep the **page components unchanged**, and only swap the data source under `src/lib/`.

**Steps**

1. Add a Sanity client in Astro:
   - `src/lib/sanityClient.ts`:
     - Reads env vars for project ID, dataset, API version, and token.
     - Exports a configured Sanity client for GROQ queries.
2. Create a new data module mirroring the existing API:
   - `src/lib/data-sanity.ts` with:
     - `getWriterById(id: string)`
     - `getWritersByYear(year: number)`
     - `getAllYears()`
     - `getWritersByGenre(genre: string)`
     - `getAllGenres()`
   - Implement each with GROQ:
     - Writers list: `*[_type == "writer"]{...}`
     - Years:
       ```groq
       array::unique(*[_type == "writer"].years[]) | order(@ desc)
       ```
3. Introduce a data‑source switch:
   - In `src/lib/data.ts`, conditionally delegate to JSON or Sanity based on an env var, e.g.:
     - `USE_SANITY=true` in Vercel to use Sanity.
     - Default to JSON locally until you’re ready.
4. Update pages (if necessary) for minor shape differences:
   - Ensure the TypeScript `Writer` type matches the Sanity document shape.
   - Adjust any assumptions that depend on the JSON structure (e.g., optional `photo` fields).

After this, you can:

- Test locally with `USE_SANITY=true` and a `.env.local`.
- Switch Vercel’s environment to use Sanity once you’re confident.

---

## 6. Sanity Studio UX & Validation

Once the data model is in place, fine‑tune Studio so that admins have a simple, safe editing experience.

**Key tasks**

- Writer document form:
  - Mark `displayName`, `lastName`, `years`, and `bio` as required.
  - Add description text to `firstNames` explaining that initials are allowed and optional.
  - Keep year validation minimal (e.g., ensure they are numbers); **do not** hard‑limit to 2004–2026 so the archive can grow backward and forward in time.
  - Provide a read‑only preview of how the name will appear (e.g., `displayName` + years).
- Lists:
  - Default `writer` list ordering: `order(lastName asc, firstNames asc)`.
  - Add filter by year and genre for editors.
- Media:
  - For audio/video arrays, require `title` and `url`, make `description` optional.
  - Add helper text clarifying expected URL hosts (L&C server, YouTube, etc.).
   - Optionally add non‑blocking validation that warns (but does not block publish) if a URL host is outside an allow‑list (e.g., not L&C media, YouTube, Vimeo, Panopto).

---

## 7. Rollout & Cutover

1. **Phase 0 (now)**:
   - Keep Astro using JSON only.
2. **Phase 1**:
   - Stand up Sanity project + Studio.
   - Import all writer data.
   - Have admins test editing in Studio (no impact on the live site yet).
3. **Phase 2**:
   - Implement `data-sanity.ts` and the data‑source switch.
   - Test locally and on a staging Vercel deployment (separate project or preview branch).
4. **Phase 3**:
   - Flip `USE_SANITY=true` on the production Vercel project.
   - Monitor builds and spot‑check pages.
   - At this point, Sanity is the **canonical** source of truth for writer data in production.
5. **Phase 4 (cleanup)**:
   - Production builds now **require** `USE_SANITY` to be enabled; if it is not, the build fails rather than silently falling back to JSON.
   - The JSON data path is retained only as a local/staging fallback (e.g., when `MODE !== "production"`), or can be fully removed in a future refactor.

This phased approach avoids a "big bang" migration and lets the department begin using Sanity Studio early while the front‑end gradually pivots over.

---

## 8. Implementation Notes (Completed)

This section documents the actual implementation details for reference.

### 8.1 File Structure

```
src/lib/
├── data.ts           # Main data module with USE_SANITY switch
├── data-sanity.ts    # Sanity-backed implementation
└── sanityClient.ts   # Sanity client configuration

scripts/
└── export-to-sanity.ts  # JSON → NDJSON export script

tmp/
└── writers.ndjson    # Generated NDJSON for Sanity import
```

### 8.2 Environment Variables

Required in `.env.local` (local) and Vercel (production):

```bash
# Sanity connection
SANITY_PROJECT_ID=o7465upq
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_READ_TOKEN=<read-only-token>

# Data source switch
USE_SANITY=true   # Set to use Sanity; omit or set to 'false' for JSON
```

For CLI import operations, also set:
```bash
SANITY_AUTH_TOKEN=<write-token>  # Higher-privilege token for imports
```

### 8.3 Key GROQ Queries

**Fetch all writers (sorted by last name):**
```groq
*[_type == "writer"] | order(lastName asc, firstNames asc) {
  "id": slug.current,
  "name": displayName,
  years,
  "genre": array::join(genres, "/"),
  bio,
  notableWorks,
  awards,
  wikipediaUrl,
  officialWebsite,
  "photo": {
    "source": coalesce(photo.source, "unknown"),
    "url": photo.url,
    "license": photo.license,
    "attribution": photo.attribution,
    "status": coalesce(photo.status, "needs_acquisition"),
    "localPath": photo.localPath,
    "notes": photo.notes
  },
  "confidence": coalesce(confidence, "medium"),
  "needsReview": coalesce(needsReview, false)
}
```

**Get writer by slug:**
```groq
*[_type == "writer" && slug.current == $id][0] {...projection}
```

**Get writers by year:**
```groq
*[_type == "writer" && $year in years] | order(lastName asc, firstNames asc) {...projection}
```

**Get writers by genre:**
```groq
*[_type == "writer" && $genre in genres] | order(lastName asc, firstNames asc) {...projection}
```

**Get all years (excluding unknown):**
```groq
array::unique(*[_type == "writer"].years[@ != 0]) | order(@ desc)
```

**Get all genres:**
```groq
array::unique(*[_type == "writer"].genres[])
```

### 8.4 Data Import Commands

Run the export script to generate NDJSON:
```bash
npx tsx scripts/export-to-sanity.ts
```

Create dev dataset and import (for testing):
```bash
SANITY_AUTH_TOKEN="$(grep SANITY_AUTH_TOKEN .env.local | cut -d= -f2)" \
  npx sanity dataset create dev --project o7465upq

SANITY_AUTH_TOKEN="$(grep SANITY_AUTH_TOKEN .env.local | cut -d= -f2)" \
  npx sanity dataset import tmp/writers.ndjson dev --project o7465upq
```

Import into production (after validation):
```bash
SANITY_AUTH_TOKEN="$(grep SANITY_AUTH_TOKEN .env.local | cut -d= -f2)" \
  npx sanity dataset import tmp/writers.ndjson production --project o7465upq
```

### 8.5 Name Parsing Overrides

The export script includes a manual override table for tricky name parsing cases. Add entries for:
- Mononyms (single names like "Jewel")
- Multi-word last names (de la Paz, Le Guin, García Márquez)
- Names with initials that parse ambiguously

See `scripts/export-to-sanity.ts` for the `nameOverrides` object.

### 8.6 Testing Locally with Sanity

1. Ensure `.env.local` has all Sanity credentials
2. Set `USE_SANITY=true` in `.env.local`
3. Run `npm run dev` and verify pages render correctly
4. Build with `npm run build` to test static generation

Rollback: Set `USE_SANITY=false` or remove the variable to fall back to JSON.

---

## 9. Automatic Deployments via Webhooks

The archive is a static Astro site, so content changes in Sanity must trigger a new Vercel build. This is accomplished using a **Vercel Deploy Hook** and a **Sanity Webhook**.

### 9.1 Architecture

```
┌─────────────────┐     Publish/Update     ┌─────────────────────┐
│  Sanity Studio  │ ─────────────────────► │  Sanity Webhook     │
│  (production)   │                        │  (HTTP POST)        │
└─────────────────┘                        └──────────┬──────────┘
                                                      │
                                                      │ POST request
                                                      ▼
                                           ┌─────────────────────┐
                                           │  Vercel Deploy Hook │
                                           │  (triggers build)   │
                                           └──────────┬──────────┘
                                                      │
                                                      │ New deployment
                                                      ▼
                                           ┌─────────────────────┐
                                           │  lc-reading-series  │
                                           │  -archive (Vercel)  │
                                           └─────────────────────┘
```

### 9.2 Vercel Deploy Hook

**Location:** Vercel Dashboard → `lc-reading-series-archive` → Settings → Git → Deploy Hooks

**Configuration:**
- **Name:** `sanity-content-update`
- **Branch:** `main`

**URL format:** `https://api.vercel.com/v1/integrations/deploy/prj_XXXXXXXXXX/YYYYYYYYYYYY`

The URL is stored securely in Vercel and used by the Sanity webhook.

### 9.3 Sanity Webhook

**Location:** Sanity Manage → Project `o7465upq` → API → Webhooks

**Configuration:**

| Setting | Value |
|---------|-------|
| Name | `vercel-deploy-trigger` |
| URL | (Vercel Deploy Hook URL) |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["writer", "siteSettings", "aboutPage"]` |
| Draft/Published | **Only published documents** |
| HTTP method | POST |
| Status | Enabled |

**Key points:**
- The filter ensures only relevant document types trigger builds
- Draft changes do **not** trigger builds — only publishing does
- The webhook only fires for the `production` dataset, not staging/dev datasets

### 9.4 Document Types That Trigger Rebuilds

| Document Type | Triggers Rebuild | Affects Pages |
|--------------|-----------------|---------------|
| `writer` | Yes | Homepage (featured), `/writers/*`, `/years/*` |
| `siteSettings` | Yes | Homepage (hero, teaser) |
| `aboutPage` | Yes | `/about` |

### 9.5 Admin Workflow

For content editors, the workflow is simple:

1. **Edit** content in Sanity Studio (https://lc-reading-series.sanity.studio/)
2. **Publish** changes (click "Publish" button)
3. **Wait** ~1-2 minutes for Vercel to rebuild
4. **Verify** changes appear on the live site

Draft changes (unsaved or saved but not published) do **not** affect the live site.

### 9.6 Manual Script for Webhook Setup

If you need to recreate the webhook programmatically:

```bash
# Add to .env.local:
# VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...

npx tsx scripts/create-sanity-webhook.ts
```

This script creates the webhook via the Sanity Management API.

### 9.7 Monitoring & Troubleshooting

**Check Vercel deployment status:**
- Vercel Dashboard → `lc-reading-series-archive` → Deployments
- Each webhook-triggered build shows "Deploy Hook" as the trigger

**Check Sanity webhook activity:**
- Sanity Manage → Project → API → Webhooks → Click webhook → "Deliveries" tab
- Shows recent webhook calls and their HTTP status codes

**Common issues:**
- **Build not triggered:** Verify the webhook filter includes the document type you edited
- **Draft changes not appearing:** Remember to click "Publish" — drafts don't trigger rebuilds
- **Webhook failures:** Check Sanity webhook deliveries for HTTP errors; verify Deploy Hook URL is correct
