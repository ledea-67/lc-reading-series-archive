# Implement: Lewis & Clark Reading Series — Concept A: "The Archive"

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

## Design Direction: "The Archive"

Emphasis on **typography as artifact**. This is not just a website—it's a preserved collection, a cabinet of literary voices. Think: the tactile weight of letterpress, the reverence of a rare books room, marginalia in a treasured volume.

### The Feeling
A visitor should feel they've entered a space of quiet significance. The words themselves are sacred objects. Time slows. Each name carries weight.

### Visual Principles

**Typography as the hero.** This concept lives or dies by its type choices. Seek fonts with genuine character—not the usual suspects. Consider:
- Serifs with personality: oldstyle figures, distinctive italics, unusual x-heights
- Contrast between display and body that creates visual rhythm
- Generous leading that lets text breathe like poetry on a page
- Explore: editorial serifs, transitional faces, or even restrained humanist sans that feel bookish

**A palette of paper and ink.** Move beyond generic cream-and-charcoal. Consider:
- The specific warmth of aged vellum vs. crisp cotton paper
- Ink that feels like actual letterpress—not pure black but rich, almost brown-black
- One considered accent: a color that might appear on a library stamp or bookplate
- Subtle tonal shifts that create depth without obvious color

**Spatial generosity.** Let the content command space as a museum does:
- Margins that feel luxurious, almost extravagant
- Asymmetric layouts that break the expected grid
- Text that sits where it needs to, not where the container puts it
- Consider: dramatically off-center alignments, text that runs to unusual widths

**The texture of time.** This is an archive spanning decades:
- Subtle paper textures or grain that don't overwhelm
- Hairline rules and borders that feel hand-drawn rather than digital
- Visual cues that suggest accumulation and history
- Avoid: anything that feels slick, startup-y, or newly minted

### Animation Philosophy
Restrained but present. The archive breathes, it doesn't bounce:
- Text that settles into place like pages finding their rest
- Hover states that feel like running a finger along a spine
- Transitions between pages like turning leaves in a book
- No animation should call attention to itself—it should feel inevitable

### Components to Create
Build in `src/components/`:

1. **Navigation** — Should feel like an index or table of contents. Consider: small caps, letterspacing, how the timeline/years might integrate organically.

2. **WriterCard** — Small portrait + name + genre. The portrait treatment is crucial: circular or rounded corners, but consider sepia, duotone, or subtle vignette effects. The name is the focus.

3. **WriterHero** — For detail pages. The photo should not dominate—the name and words should. Bio reads like a brief entry in a literary encyclopedia.

4. **YearSection** — Year headings that carry weight. Consider oversized numerals, distinctive placement, or typographic treatments that mark each year as a chapter.

5. **Timeline** — The organizational spine of the archive. Could be vertical with writers branching off, or a more abstracted representation. The years themselves should feel significant.

6. **Footer** — Minimal and dignified. A colophon.

### Page Guidance

**Homepage** — An invitation into the archive. The title should feel considered, perhaps dramatically sized. A curated glimpse of writers—not a busy grid but a thoughtful selection. Clear paths inward.

**Timeline/Years Index** — The spine of the collection. Each year expandable or navigable. This page should feel comprehensive yet readable. Consider showing writer count per year subtly.

**Year Detail** — Year as a prominent heading. Writers from that year arranged with care—not necessarily a grid. Navigation to adjacent years should feel like turning pages.

**Writer Detail** — A considered profile. Photo (if available) should complement, not compete with, the name and bio. Works and awards presented cleanly. External links understated.

**Writers Index** — Could be more utilitarian—an alphabetical reference. Perhaps a different treatment that signals "index" vs. the curated timeline experience.

**About** — Clean prose. Room for the series history to unfold.

### Responsive Approach
- Desktop: generous margins, room for asymmetry
- Tablet: maintain reading comfort, adapt gracefully
- Mobile: single column, timeline becomes vertical list, maintain typographic quality

### Photo Treatment
Photos are 400×500px WebP at 4:5 portrait ratio. Consider:
- Consistent treatment across all portraits (sepia? duotone? desaturated?)
- Subtle borders or framing that feels archival
- Placeholder treatment for missing photos that feels intentional, not broken

## Deliverable
The complete styled site. Run `npm run dev` and all pages should feel like a unified, lovingly designed archive. Create a brief DESIGN.md documenting your typographic choices and overall approach.
