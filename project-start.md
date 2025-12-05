# Lewis & Clark College Reading Series Archive - Project Start

**Created**: 2024-12-04
**GitHub Repository**: https://github.com/ledea-67/lc-reading-series-archive

## Project Overview

A static website archiving the Lewis & Clark College Reading Series (2004-2026), featuring 108 literary writers. This is the **base environment only**—no visual design. The architecture is ready for three different design concepts to build upon in separate branches/worktrees.

## Technology Stack

- **Framework**: Astro (v5.16.4) with static site generation
- **Language**: TypeScript (strict mode)
- **Styling**: Scoped CSS (Astro's default) - minimal reset only
- **Output**: Static HTML (114 pages generated)

## Project Structure

```
src/
├── assets/
│   ├── fonts/          # Custom fonts (empty - for design phase)
│   └── images/         # Site images (empty - for design phase)
├── components/         # Reusable components (empty - for design phase)
├── data/
│   └── writers.json    # 108 writers with full metadata
├── layouts/
│   └── Base.astro      # HTML5 base layout with minimal reset
├── lib/
│   └── data.ts         # Data utilities and query helpers
├── pages/
│   ├── index.astro     # Homepage
│   ├── about.astro     # About the series
│   ├── writers/
│   │   ├── index.astro # All writers browse view
│   │   └── [id].astro  # Individual writer pages (108 generated)
│   └── years/
│       ├── index.astro # Timeline/all years
│       └── [year].astro# Writers by year
└── types/
    └── writer.ts       # TypeScript type definitions

public/
└── photos/
    └── placeholder.svg # Placeholder for missing writer photos
```

## Data Layer

### TypeScript Types (`src/types/writer.ts`)

```typescript
interface Writer {
  id: string;
  name: string;
  years: number[];        // 0 = unknown year
  genre: string;
  bio: string;
  notableWorks: string[];
  awards: string[];
  wikipediaUrl: string | null;
  officialWebsite: string | null;
  photo: WriterPhoto;
  confidence: 'high' | 'medium' | 'low';
  needsReview: boolean;
}
```

### Utility Functions (`src/lib/data.ts`)

| Function | Description |
|----------|-------------|
| `getWriterById(id)` | Get single writer by ID |
| `getWritersByYear(year)` | Get writers from a specific year |
| `getWritersByGenre(genre)` | Get writers by genre (handles compound genres) |
| `getAllYears()` | Sorted array of years (excludes 0) |
| `getWritersWithUnknownYear()` | Writers with year = 0 |
| `getAllGenres()` | All unique genres |

### Path Aliases (configured in `tsconfig.json`)

- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@lib/*` → `src/lib/*`
- `@data/*` → `src/data/*`
- `@types/*` → `src/types/*`

## Routes

| Route | Description | Pages Generated |
|-------|-------------|-----------------|
| `/` | Homepage with featured writers and years | 1 |
| `/about` | About the series | 1 |
| `/writers` | Browse all writers | 1 |
| `/writers/[id]` | Individual writer pages | 108 |
| `/years` | Timeline view | 1 |
| `/years/[year]` | Writers by year | 2 (2017, 2018) |

**Total**: 114 static pages

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Development server (localhost:4321)
npm run build    # Production build (~400ms)
npm run preview  # Preview production build
```

## Creating Design Worktrees

```bash
# Create worktrees for different design concepts
git worktree add ../design-minimal -b design/minimal
git worktree add ../design-bold -b design/bold
git worktree add ../design-classic -b design/classic

# Navigate to a worktree
cd ../design-minimal
npm install
npm run dev

# List all worktrees
git worktree list

# Remove a worktree
git worktree remove ../design-concept-name
```

## Design Implementation Guidelines

When implementing designs in worktrees:

1. **Don't modify**: `src/data/`, `src/lib/data.ts`, or `src/types/`
2. **Add components**: Create in `src/components/`
3. **Update layouts**: Modify `src/layouts/Base.astro` or create new layouts
4. **Add fonts**: Place in `src/assets/fonts/` and import in layout
5. **Add photos**: Place in `public/photos/` with filenames matching writer IDs (e.g., `ondaatje-michael.jpg`)

## Data Notes

- **108 total writers** in the dataset
- Writers with `years: [0]` have unknown appearance years
- `confidence` field indicates data reliability (high/medium/low)
- `needsReview: true` flags entries needing verification
- Photos with `status: 'needs_acquisition'` don't have images yet
- Most writers currently have `year: 0` (unknown) - only 2017 and 2018 have confirmed dates

## Files Not Tracked

The following are in `.gitignore`:
- `node_modules/`
- `dist/`
- `.astro/`
- Environment files (`.env`, `.env.*`)
