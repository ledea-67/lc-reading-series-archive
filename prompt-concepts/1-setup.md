# Setup: Create a Design Worktree

Before implementing a design concept, run these commands to create an isolated worktree.

## Create the Worktree

```bash
# From the main project directory
cd /Users/stephentoutonghi/projects/lewis-clark/author-series

# Create a new branch and worktree for your concept
# Replace "archive" with your concept name (archive, gallery, or chronicle)
git worktree add ../author-series-archive -b design/archive

# Move into the worktree
cd ../author-series-archive

# Install dependencies
npm install

# Download and process writer photos (creates public/images/writers/*.webp)
npm run process-photos

# Verify setup
npm run dev
```

## Worktree Directory Structure

After setup, your worktree will have:

```
author-series-archive/
├── src/
│   ├── components/        # Empty - you'll create components here
│   ├── data/
│   │   └── writers.json   # 108 writers with full data
│   ├── layouts/
│   │   └── Base.astro     # Base layout (customize freely)
│   ├── lib/
│   │   └── data.ts        # Data loading functions
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── writers/
│   │   │   ├── index.astro
│   │   │   └── [id].astro
│   │   └── years/
│   │       ├── index.astro
│   │       └── [year].astro
│   └── types/
│       └── writer.ts      # TypeScript interfaces
├── public/
│   └── images/
│       └── writers/       # 106 photos as 400×500 WebP
└── prompt-concepts/
    ├── 2a-archive.md
    ├── 2b-gallery.md
    └── 2c-chronicle.md
```

## Available Data Functions

From `src/lib/data.ts`:

```typescript
// All writers
import { writers } from '../lib/data';

// Get writer by ID
import { getWriterById } from '../lib/data';
const writer = getWriterById('ondaatje-michael');

// Get writers from a specific year
import { getWritersByYear } from '../lib/data';
const writers2017 = getWritersByYear(2017);

// Get all years (sorted descending)
import { getAllYears } from '../lib/data';
const years = getAllYears(); // [2026, 2025, 2024, ...]

// Get writers by genre
import { getWritersByGenre } from '../lib/data';
const poets = getWritersByGenre('poetry');

// Get all unique genres
import { getAllGenres } from '../lib/data';
const genres = getAllGenres(); // ['criticism', 'fiction', 'nonfiction', 'poetry']
```

## Photo Paths

Photos are at `/images/writers/{writer-id}.webp` (e.g., `/images/writers/ondaatje-michael.webp`).

Check `writer.photo.status === 'available'` before rendering an image. Use a placeholder for unavailable photos.

## Next Step

Copy the content of your chosen design prompt (2a, 2b, or 2c) into a new Claude Code session with the worktree as the working directory.
