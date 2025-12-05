# The Archive — Design Documentation

## Concept

"The Archive" treats the Lewis & Clark College Reading Series website not as a typical website but as a **preserved collection**—a cabinet of literary voices. The design draws inspiration from rare books rooms, letterpress printing, and literary archives. Visitors should feel they've entered a space of quiet significance where words are sacred objects and each name carries weight.

---

## Typography

### Primary Typeface: Cormorant Garamond

**Selection rationale:** Cormorant Garamond is a modern interpretation of Claude Garamond's classic 16th-century typeface. It offers:

- **Tall ascenders and distinctive italics** that feel genuinely bookish
- **Oldstyle figures** that sit naturally within body text
- **Generous x-height** for readability while maintaining elegance
- **Character and personality** without being decorative

Cormorant handles both display and body text, creating visual continuity throughout the archive while offering enough weight variations (300–600) for hierarchy.

### Secondary Typeface: Spectral

**Selection rationale:** Spectral is a modern serif designed for digital reading. Used for:

- **UI elements** (navigation, labels, genre tags)
- **Meta information** (dates, counts, captions)
- **Italic emphasis** in interface contexts

Spectral's slightly narrower proportions and cleaner construction distinguish it from Cormorant, signaling "navigation" versus "content."

### Type Scale

The scale uses a **1.333 ratio** (perfect fourth), creating dramatic contrast between display sizes and comfortable reading sizes:

```
--text-xs:    0.75rem   (12px)
--text-sm:    0.875rem  (14px)
--text-base:  1.125rem  (18px) — generous body text
--text-lg:    1.25rem   (20px)
--text-xl:    1.5rem    (24px)
--text-2xl:   2rem      (32px)
--text-3xl:   2.5rem    (40px)
--text-4xl:   3.5rem    (56px)
--text-5xl:   4.5rem    (72px)
--text-hero:  6rem      (96px) — dramatic moments
```

### Line Height

Poetry-like spacing with generous leading:

```
--leading-tight:   1.2   (headings)
--leading-snug:    1.35  (subheads)
--leading-normal:  1.65  (body text)
--leading-relaxed: 1.85  (featured prose)
--leading-loose:   2.0   (dramatic emphasis)
```

---

## Color Palette

The palette evokes **paper and ink**—specific archival tones rather than generic cream-and-charcoal.

### Papers (Backgrounds)

| Token | Hex | Use |
|-------|-----|-----|
| `--paper-aged` | `#f5f1e8` | Footer, aged sections |
| `--paper-warm` | `#faf8f3` | Primary background |
| `--paper-cotton` | `#fcfbf9` | Cards, elevated surfaces |

### Inks (Text)

| Token | Hex | Use |
|-------|-----|-----|
| `--ink-deep` | `#1a1612` | Headings, emphasis |
| `--ink-body` | `#2d2520` | Body text |
| `--ink-soft` | `#4a433c` | Secondary text |
| `--ink-muted` | `#7a716a` | Meta, labels |
| `--ink-faint` | `#a89f96` | Disabled, attribution |

### Accent

| Token | Hex | Use |
|-------|-----|-----|
| `--accent-stamp` | `#8b3a3a` | Links, hover states (library stamp red) |
| `--accent-faded` | `#a86a5d` | Selection highlight |

### Rules (Borders)

| Token | Hex | Use |
|-------|-----|-----|
| `--rule-dark` | `#3d352f` | Strong emphasis |
| `--rule-medium` | `#8a7f74` | Moderate dividers |
| `--rule-light` | `#c9c1b6` | Subtle dividers |
| `--rule-faint` | `#e5dfd6` | Ghost dividers |

---

## Spatial System

### Philosophy

Margins should feel **luxurious, almost extravagant**—like a rare books room, not a startup landing page.

### Spacing Scale

```
--space-1:   0.25rem  (4px)
--space-2:   0.5rem   (8px)
--space-3:   0.75rem  (12px)
--space-4:   1rem     (16px)
--space-5:   1.5rem   (24px)
--space-6:   2rem     (32px)
--space-8:   3rem     (48px)
--space-10:  4rem     (64px)
--space-12:  5rem     (80px)
--space-16:  7rem     (112px)
--space-20:  9rem     (144px)
```

### Page Margins

```
--margin-page:        clamp(1.5rem, 8vw, 8rem)
--margin-page-narrow: clamp(1rem, 4vw, 3rem)
```

### Content Widths

```
--width-prose:   38rem  (~65 characters, optimal reading)
--width-content: 52rem  (two-column layouts)
--width-wide:    72rem  (grids, expansive views)
--width-full:    90rem  (maximum container)
```

---

## Visual Texture

### Paper Grain

A subtle SVG noise texture overlays the background, simulating paper grain:

```css
background-image: url("data:image/svg+xml,...");
background-blend-mode: soft-light;
background-size: 200px;
```

This creates depth without overwhelming the content—visible at a subconscious level.

### Hairline Rules

Borders use gradient fades rather than solid lines, feeling more hand-drawn:

```css
background: linear-gradient(
  to right,
  transparent,
  var(--rule-medium) 15%,
  var(--rule-medium) 85%,
  transparent
);
```

### Ornaments

The section symbol (§) serves as a dignified divider, echoing book typography:

```
§
```

---

## Animation

### Philosophy

**Restrained but present.** The archive breathes, it doesn't bounce. Animations should feel like pages settling into place—inevitable rather than attention-seeking.

### Timing

```
--ease-out:        cubic-bezier(0.22, 1, 0.36, 1)
--ease-in-out:     cubic-bezier(0.65, 0, 0.35, 1)
--duration-fast:   150ms
--duration-normal: 300ms
--duration-slow:   500ms
--duration-slower: 800ms
```

### Primary Animation: "Settle"

Elements fade in and rise slightly into their final position:

```css
@keyframes settle {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Stagger Pattern

Lists animate with subtle delays (30–80ms per item) creating a cascade effect without being distracting.

### Hover States

- **Links:** Color shifts to accent, subtle underline reveals
- **Cards:** Slight lift (2px), shadow deepens
- **Arrows:** Small translate in direction of travel

---

## Photo Treatment

### Archival Filter

All portraits receive a subtle sepia/desaturation treatment:

```css
filter: sepia(12%) saturate(92%) contrast(96%);
```

This creates consistency across varied source photography and reinforces the archival aesthetic.

### Vignette

A radial gradient overlay adds depth:

```css
background: radial-gradient(
  ellipse at center,
  transparent 40%,
  rgba(26, 22, 18, 0.12) 100%
);
```

### Placeholder

Missing photos show a dignified silhouette placeholder that feels intentional rather than broken.

---

## Component Summary

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **Navigation** | Table of contents header | Small caps, letterspacing, sticky |
| **Footer** | Colophon | Minimal, centered, section symbol |
| **WriterCard** | Grid item | Portrait + name + genre, sepia treatment |
| **WriterHero** | Detail header | Portrait sidebar, dramatic name, bio |
| **YearSection** | Chapter marker | Oversized numeral, rule decoration |
| **Timeline** | Navigation spine | Vertical markers, year dots |

---

## Responsive Approach

### Desktop (>900px)
- Generous margins (up to 8rem)
- Multi-column layouts
- Sticky sidebars
- Full timeline navigation

### Tablet (768–900px)
- Moderate margins
- Single column with adapted grids
- Simplified navigation

### Mobile (<768px)
- Narrow margins
- Single column throughout
- Vertical timeline
- Typographic scale reduction (20–25%)

---

## Accessibility

- **Focus states:** Visible outline in accent color
- **Color contrast:** All text meets WCAG AA standards
- **Skip navigation:** Semantic landmarks
- **Motion:** Respects `prefers-reduced-motion`
- **Font scaling:** Relative units throughout

---

## Files Structure

```
src/
├── components/
│   ├── Navigation.astro
│   ├── Footer.astro
│   ├── WriterCard.astro
│   ├── WriterHero.astro
│   ├── YearSection.astro
│   └── Timeline.astro
├── layouts/
│   └── Base.astro
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── writers/
│   │   ├── index.astro
│   │   └── [id].astro
│   └── years/
│       ├── index.astro
│       └── [year].astro
└── styles/
    └── global.css
```

---

## Summary

"The Archive" succeeds through **restraint and intention**. Every typographic choice, every spacing decision, every subtle animation serves the goal of creating a space where literary voices are treated with the reverence they deserve. The design doesn't call attention to itself—it recedes, allowing the writers and their words to take center stage.
