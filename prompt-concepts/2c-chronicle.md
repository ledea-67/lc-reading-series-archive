# Implement: Lewis & Clark Reading Series — Concept C: "The Chronicle"

## Context
This Astro project is set up with:
- **108 writers** with full data (bios, works, awards, years) in `src/data/writers.json`
- Data functions in `src/lib/data.ts`: `getWriterById()`, `getWritersByYear()`, `getAllYears()`, `getWritersByGenre()`, `getAllGenres()`
- TypeScript types in `src/types/writer.ts` (includes `Writer`, `WriterPhoto`)
- Page routes: index, about, writers/[id], writers/index, years/[year], years/index
- Base layout in `src/layouts/Base.astro`
- **106 photos** at `public/images/writers/{id}.webp` (400×500px, 4:5 portrait ratio)

Your job is to **implement the visual design** for this concept.

## Read First
Invoke the `frontend-design` skill before beginning.

## Design Direction: "The Chronicle"

Emphasis on **narrative and the passage of time**. This is a story told through years and voices. Think: walking through a museum exhibition, turning pages in a beautifully designed book, a documentary unfolding. The journey through time is the experience.

### The Feeling
A visitor should feel they're embarking on a journey. Each year is a chapter. Scrolling is traveling through time. There's a sense of accumulation—the weight of two decades of literary voices building. This is immersive and memorable.

### Visual Principles

**The scroll is the story.** The main experience unfolds vertically (or horizontally—commit to one):
- Each year as a distinct "chapter" or "room" to pass through
- Transitions between years that mark the passage of time
- Progress indication that tells you where you are in the story
- The feeling that you're moving through something, not just viewing it

**Dramatic typography.** Years should feel monumental:
- Oversized year displays—numbers as design elements
- Consider years that fill the viewport, that you scroll past or through
- Type that creates atmosphere: layered, faded, repeated, or dimensional
- Names and text that emerge from the timeline

**Atmospheric depth.** This isn't flat—it has layers:
- Parallax between foreground and background elements
- Text and images at different depths
- Subtle gradients, shadows, or blurs that create space
- Could be dark and cinematic or light and airy—but dimensional

**Balance of moments.** Photos and text tell the story together:
- Writers presented within their year, not just listed
- Consider how a writer's presence unfolds as you scroll to them
- Full-viewport "pause" moments for emphasis
- Denser sections between the breathing room

### Animation Philosophy
This concept demands motion—but orchestrated, not chaotic:
- Scroll-triggered reveals that feel choreographed
- Year transitions that feel like chapters turning
- Elements that fade, slide, scale, or layer as you scroll
- Progress indicators that move with you
- Possible: sticky elements, pinned sections, horizontal scroll segments
- Honor reduced-motion preferences with graceful fallbacks

### Components to Create
Build in `src/components/`:

1. **Navigation** — Minimal or hidden. The timeline IS the navigation. Consider: a floating progress indicator, year markers you can jump to, or a minimal home link that stays out of the way.

2. **ChapterSection** — Full-height (or near-full) section representing a year. Contains the YearHeader and its writers. This is the core building block.

3. **YearHeader** — Dramatic year display. Large, possibly layered or dimensional. The moment of entering a new chapter.

4. **WriterInChapter** — A writer's presentation within the timeline. Not a card—an integrated presence. Photo and text together, revealed as part of the scroll experience.

5. **ProgressIndicator** — Shows position in the timeline. Could be: a vertical line with year markers, a timeline scrubber, a subtle progress bar, floating year display.

6. **WriterSpotlight** — For the individual writer detail page. Immersive, focused, story-like. A moment of pause from the flow.

7. **TransitionElement** — Visual bridge between years. A line, a date, an animation, negative space. Marks the passage of time.

8. **Footer** — Minimal. The chronicle should end naturally, perhaps with a quiet colophon.

### Page Guidance

**Homepage/Entry** — Sets the stage. Could be a full-screen title that invites you in ("Enter the Chronicle" or simply an elegant landing). Or: scroll directly into the first year. The entry should feel intentional.

**Chronicle View (Timeline/Years)** — THE experience. The centerpiece. One long scroll with all years as chapters, or a paginated sequence—either can work, commit fully. Progress indication is essential. Each year should feel like entering a new space.

**Year Detail** (if separate from main chronicle) — An immersive chapter for one year. Writers with room to breathe. Navigation to adjacent years that feels like page turns.

**Writer Detail** — A quiet, focused page. One voice, one moment. Large photo if available. Bio reads as a short profile. Return to timeline should feel like resuming the journey.

**Writers Index** — The "index at the back of the book." Utilitarian compared to the main experience. Alphabetical, searchable. Clearly a reference, not the main attraction.

**About** — Part of the narrative. Perhaps the "afterword." Could be reached at the end of the chronicle or separately. The story of the series itself.

### Responsive Approach
- Desktop: full immersive experience, room for parallax and horizontal moments
- Tablet: scaled immersion, vertical scroll preferred, maintained drama
- Mobile: fully vertical, chapters still distinct, touch-friendly, timeline adapted

### Technical Notes
Keep the scroll experience performant:
- CSS-based animations where possible (transform, opacity)
- Intersection Observer for scroll triggers
- Debounced handlers for scroll-linked effects
- Test on real devices
- Reduced-motion preferences should gracefully simplify, not break

### Photo Treatment
Photos are 400×500px WebP at 4:5 portrait ratio. Consider:
- How photos emerge within the scroll narrative
- Possible treatments: fade in, parallax, scale shifts
- Placeholder approach for missing photos

### Mood
Think: Turning pages in a beautiful book. A museum walkthrough you don't want to end. An exhibition you tell friends about. Not rushed, not flashy—immersive and human. Twenty years of literary voices deserve this care.

## Deliverable
The complete styled site with the chronicle experience as the centerpiece. Run `npm run dev` and navigate the full experience. Create a DESIGN.md documenting your scroll strategy, animation approach, and key decisions.
