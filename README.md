# Lewis & Clark College Reading Series Archive

A static website archiving the Lewis & Clark College Reading Series (2004-2026), featuring ~100 literary writers.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── assets/
│   ├── fonts/          # Custom fonts (add during design phase)
│   └── images/         # Site images
├── components/         # Reusable Astro components (add during design phase)
├── data/
│   └── writers.json    # Writer data
├── layouts/
│   └── Base.astro      # Base HTML layout
├── lib/
│   └── data.ts         # Data utilities and helpers
├── pages/
│   ├── index.astro     # Homepage
│   ├── about.astro     # About the series
│   ├── writers/
│   │   ├── index.astro # All writers browse view
│   │   └── [id].astro  # Individual writer pages
│   └── years/
│       ├── index.astro # Timeline/all years
│       └── [year].astro# Writers from a specific year
└── types/
    └── writer.ts       # TypeScript type definitions

public/
└── photos/
    └── placeholder.svg # Placeholder for missing writer photos
```

## Data Utilities

Import data helpers from `src/lib/data.ts`:

```typescript
import {
  writers,              // All writer data
  metadata,             // Dataset metadata
  getWriterById,        // Get single writer by ID
  getWritersByYear,     // Get writers from a specific year
  getWritersByGenre,    // Get writers by genre
  getAllYears,          // Get sorted array of years (excludes unknown)
  getWritersWithUnknownYear, // Get writers with year = 0
  getAllGenres,         // Get all unique genres
} from '../lib/data';
```

## Path Aliases

The project supports these import aliases (configured in `tsconfig.json`):

- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@lib/*` → `src/lib/*`
- `@data/*` → `src/data/*`
- `@types/*` → `src/types/*`

## Creating Design Worktrees

This base environment is designed for multiple design concepts to build upon using git worktrees. Here's how to create a new design branch:

```bash
# Create a new worktree for a design concept
git worktree add ../design-concept-name -b design/concept-name

# Navigate to the worktree
cd ../design-concept-name

# Install dependencies
npm install

# Start developing
npm run dev
```

### Example: Three Design Concepts

```bash
# Minimalist design
git worktree add ../design-minimal -b design/minimal

# Bold/experimental design
git worktree add ../design-bold -b design/bold

# Classic/traditional design
git worktree add ../design-classic -b design/classic
```

### Managing Worktrees

```bash
# List all worktrees
git worktree list

# Remove a worktree (from main repo)
git worktree remove ../design-concept-name

# Prune stale worktree references
git worktree prune
```

## Design Implementation Guidelines

When implementing designs in worktrees:

1. **Don't modify** `src/data/`, `src/lib/data.ts`, or `src/types/` unless necessary
2. **Add components** to `src/components/` for reusable design elements
3. **Update layouts** by modifying `src/layouts/Base.astro` or creating new layouts
4. **Add fonts** to `src/assets/fonts/` and import in your layout
5. **Add photos** to `public/photos/` with filenames matching writer IDs (e.g., `ondaatje-michael.jpg`)

## Technology Stack

- **Framework**: [Astro](https://astro.build/) (static site generation)
- **Language**: TypeScript (strict mode)
- **Styling**: Scoped CSS (Astro's default)
- **Output**: Static HTML files

## Data Notes

- Writers with `years: [0]` have unknown appearance years
- `confidence` field indicates data reliability (high/medium/low)
- `needsReview` flags entries that may need verification
- Photos with `status: 'needs_acquisition'` don't have images yet
