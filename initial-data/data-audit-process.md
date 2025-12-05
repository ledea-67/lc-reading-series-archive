# Lewis & Clark College Reading Series - Data Audit Process

## Problem Statement

The current `writers-sample.json` has incomplete data for most writers:
- **Years**: Most writers have `years: [0]` (unknown) when the actual year data exists in the PDF
- **Photos**: Most writers have `photo.status: "needs_acquisition"` when photos may be available
- **Checklist**: Writers were marked "done" when data was incomplete

## Data Sources

1. **PDF**: `Lewis-Clark-for-Pauls-Sheet1.pdf` - Contains year-to-writer mappings
2. **JSON**: `writers-sample.json` - Current writer data (108 writers)
3. **Checklist**: `writer-checklist.md` - Tracking document (needs updating)

## Required Data Per Writer

Each writer entry must have:

| Field | Required | Status Check |
|-------|----------|--------------|
| `id` | Yes | Must be unique slug |
| `name` | Yes | Full name |
| `years` | Yes | Actual year(s), not `[0]` unless truly unknown |
| `genre` | Yes | poetry/fiction/nonfiction/criticism |
| `bio` | Yes | 2-3 sentence description |
| `notableWorks` | If exists | Array of titles |
| `awards` | If exists | Array of awards |
| `wikipediaUrl` | If exists | Valid URL or null |
| `officialWebsite` | If exists | Valid URL or null |
| `photo.source` | Yes | wikimedia/official/press/etc. |
| `photo.url` | Yes | Direct URL to image source |
| `photo.license` | Yes | CC BY, public domain, fair use, etc. |
| `photo.attribution` | Yes | Credit line |
| `photo.status` | Yes | "available" or "unavailable" (not "needs_acquisition") |
| `confidence` | Yes | high/medium/low |
| `needsReview` | Yes | true/false |

## Audit Process

### Phase 1: Extract Years from PDF

1. Read the PDF grid carefully
2. Map each writer name to their appearance year(s)
3. Create a year-mapping file for reference

### Phase 2: Photo Research

For each writer, search in order:
1. **Wikimedia Commons** - Preferred (clear licensing)
2. **Official website** - Author photos with permission
3. **Publisher press kits** - Often have author photos
4. **University faculty pages** - For academic writers
5. **Wikipedia** - May have public domain images

Record for each photo:
- Source URL
- License type
- Attribution required
- Whether download is permitted

### Phase 3: Update JSON

For each writer:
1. Update `years` with actual year(s)
2. Update `photo` object with found image data
3. Set `photo.status` to "available" or "unavailable" (final determination)
4. Update `confidence` based on data completeness
5. Set `needsReview` to false only if all required data is present

### Phase 4: Update Checklist

Redefine completion criteria:
- `[ ]` = Missing year OR missing photo research
- `[~]` = Has year but missing photo, OR vice versa
- `[x]` = Has year AND photo research complete (even if photo unavailable)
- `[?]` = Identity unclear or needs verification

## Batch Processing Strategy

Process writers in batches of 10-15 to:
- Maintain focus and accuracy
- Allow for saving progress
- Enable parallel photo research

### Suggested Batches (alphabetical)

1. Aamina Ahmad → Arthur Bradford (14 writers)
2. Betsy Amster → Corey Van Landingham (12 writers)
3. D.A. Powell → Eric Schlosser (12 writers)
4. Erin Ergenbright → Hamid Ismailov (10 writers)
5. Henry Carlisle → John Beer (12 writers)
6. John Casteen → Kaui Hart Hemmings (12 writers)
7. Kevin Prufer → Lisa Wells (10 writers)
8. Lois Leveen → Marian Pierce (10 writers)
9. Marianne Boruch → Michael McGriff (12 writers)
10. Michael Ondaatje → Youssef Rakha (remaining ~14 writers)

## Output Files

After audit completion:
- `writers.json` - Updated complete data
- `writer-checklist.md` - Updated with accurate status
- `photo-sources.md` - Documentation of photo sources and licenses
- `year-mapping.md` - Reference for year assignments

## Quality Checks

Before marking complete:
- [ ] No writer has `years: [0]` unless year is genuinely unknown
- [ ] No writer has `photo.status: "needs_acquisition"`
- [ ] All photo URLs are valid
- [ ] All licenses are documented
- [ ] Checklist accurately reflects data status
