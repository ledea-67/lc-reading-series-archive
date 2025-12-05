# Implement: Lewis & Clark Reading Series — Concept B: "The Gallery"

## Context
You're working in a git worktree branched from the base project. The Astro project is already set up with:
- Writer data loaded from `src/data/writers.json` via functions in `src/lib/data.ts`
- TypeScript types in `src/types/writer.ts` (includes `Writer`, `WriterPhoto` with `localPath` field)
- Page routes: index, about, writers/[id], writers/index, years/[year], years/index
- Base layout in `src/layouts/Base.astro`
- Photos at `public/images/writers/{id}.webp` (400×500px, 4:5 portrait ratio)

Your job is to **implement the visual design** for this concept.

## Read First
Invoke the `frontend-design` skill before beginning.

## Design Direction: "The Gallery"

Emphasis on **visual presence and celebration**. These are accomplished writers—their faces tell stories. Think: a literary photography exhibition, an author feature spread in a prestigious magazine, the walls of a cultural institution.

### The Feeling
A visitor should feel they're encountering significant figures. The photography draws you in. Names register with weight. This is celebration without being flashy—contemporary and sophisticated.

### Visual Principles

**Photography is paramount.** The portraits are the visual center:
- Large, confident image presentation
- Consider dramatic crops, unexpected positioning
- Let photos breathe—don't crowd them with text overlay unless it truly works
- Image hover states should feel substantial: lift, zoom, or reveal

**Editorial sophistication.** This isn't a basic photo grid—it's curated:
- Asymmetric compositions where images and text play off each other
- Pull quotes, large names, overlapping elements
- Dramatic scale shifts between elements
- Consider: one massive image beside several smaller ones, rather than uniform grids

**A bold but refined palette.** Move beyond safe neutrals:
- Strong contrast: true blacks, pure whites, or deliberate tints
- One accent color used with confidence—for highlights, hover states, calls to action
- Could go dramatic (black backgrounds, light type) or high-key (bright, editorial white)
- Whatever direction: commit fully

**Typography that holds its own.** With strong photos, type must be strong too:
- Display faces with presence for names and headings
- Avoid generic geometric sans-serifs—find something with character
- Consider condensed or extended faces for drama
- Body text must remain readable against photographic contexts

### Animation Philosophy
Smooth and confident. The gallery comes alive:
- Image reveals on scroll—fade up, scale subtly, parallax layers
- Cards that lift with shadow on hover, images that zoom
- Page transitions that feel like moving through exhibition rooms
- Microinteractions that reward exploration

### Components to Create
Build in `src/components/`:

1. **Navigation** — More prominent than the Archive concept. Clean branding moment. Sticky header that knows when to get out of the way.

2. **WriterCard** — Visual card with photo dominant. Name positioned with intention—overlaid, below, or beside. Genre as a subtle tag. Hover effect is essential and should feel premium.

3. **WriterGrid** — Responsive grid that feels curated, not templated. Consider masonry, bento-style arrangements, or uniform grids with intentional breaks.

4. **HeroSection** — Full-width capability for dramatic moments. Large photo contexts. Could feature a collage, single portrait, or abstract pattern.

5. **WriterDetail** — The individual profile. This is an author feature spread. Large hero photo, elegant bio layout, works displayed as more than a list.

6. **YearBanner** — Visual marker for year sections. Could be bold typography, a pattern, or photographic element.

7. **FilterBar** — For browsing by genre, possibly year. Clean toggle or dropdown UI that doesn't distract from the photography.

8. **Footer** — More substantial. Quick links, acknowledgments, institutional presence.

### Page Guidance

**Homepage** — A bold statement. Hero section that announces the collection. Featured writers displayed with impact—not a list, a showcase. Clear visual paths inward.

**Writers Index (Browse)** — The main attraction. Card grid of all writers. Filtering by genre and/or year. This page should feel like the gallery floor—engaging, browsable, visual feast.

**Year Detail** — Hero banner with the year treated boldly. Gallery grid of that year's writers. Navigation to adjacent years.

**Writer Detail** — An author profile spread. Large hero photo (full-width or commanding placement). Bio reads like a magazine feature. Works presented attractively—could be cards, could be an elegant list. Awards highlighted. Links prominent but designed.

**Timeline/Years Index** — More visual than utilitarian. Year "cards" with visual presence. Each year could show a featured photo or writer count.

**About** — Editorial layout. Could include photography of the venue or campus. The story of the series told with visual support.

### Responsive Approach
- Desktop: 3-4 column grids, dramatic heroes, room for asymmetry
- Tablet: 2 columns, scaled heroes, maintained drama
- Mobile: single column, stacked cards, touch-friendly, swipe where appropriate

### Photo Treatment
Photos are 400×500px WebP at 4:5 portrait ratio. Consider:
- How to handle the consistent aspect ratio in varied grid contexts
- Placeholder design that feels intentional—initials, gradient, or pattern
- Consistent image treatment or deliberate variety

## Deliverable
The complete styled site. Run `npm run dev` and all pages should feel like a contemporary gallery exhibition. Create a brief DESIGN.md documenting your approach to the photo-forward concept and key design decisions.
