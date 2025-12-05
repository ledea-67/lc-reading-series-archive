# Writer Data Audit - Start Prompt

Copy and paste this prompt into a new Claude Code window to continue the audit process.

---

## CURRENT STATUS

**100 of 108 writers audited.** Next: continue with remaining unaudited writers (Batch 11).

- Progress: 100/108 writers complete (93%)
- Data file: `initial-data/writers-sample.json` (single source of truth)
- Notes:
  - Catherine Ellis has limited online presence and may need photo verification
  - Paul Merchant photo needs verification - limited online presence
- Batch 10 completed: Paul K. Saint-Amour, Paul Merchant, Pauls Toutonghi, Peter Ames Carlin, Peyton Marshall, Rebecca Clarren, Rick Barot, Rob LaZebnik, Ryan White, Samiya Bashir

---

## WORKFLOW

**Important:** All writer data is stored in a single file: `writers-sample.json`.

Do NOT create separate batch files. Update `writers-sample.json` directly during each audit session.

---

## PROMPT FOR CONTINUING

```
Continue the writer data audit for the Lewis & Clark Reading Series Archive.

Project: `/Users/stephentoutonghi/projects/lewis-clark/author-series`

**Workflow:**
1. Read `initial-data/writers-sample.json` - this is the single source of truth
2. Read `initial-data/year-mapping.md` - has all year data
3. Read `initial-data/audit-tracker.json` - shows which writers are audited

**Find the next unaudited writers** by looking for entries where:
- `years: [0]` (needs year from year-mapping.md)
- `photo.status: "needs_acquisition"` (needs photo research)

**For each unaudited writer:**
1. Get their year(s) from year-mapping.md
2. Research their photo using these sources (in order):
   - Official author websites
   - University faculty pages
   - Publisher author pages (Penguin, Macmillan, etc.)
   - Literary organizations (Poetry Foundation, Academy of American Poets)
   - Arts residencies (MacDowell, Yaddo, Bread Loaf)
   - IMDB (for writer-filmmakers)
3. Update the writer's record DIRECTLY in writers-sample.json
4. Update audit-tracker.json to mark them as audited

**IMPORTANT - Photo Research Guidelines:**
- This is a non-commercial archive project
- DO NOT mark photos as "unavailable" just because they're not on Wikimedia Commons
- Almost every published author has publicly available photos
- A simple Google search for "[Author Name] writer photo" will find photos
- Set license to "press" for photos from official/publisher/university sources
- Only mark "unavailable" if you genuinely cannot find ANY photo after thorough searching

**Output:**
1. Update writer records directly in `initial-data/writers-sample.json`
2. Update `initial-data/audit-tracker.json` (set yearComplete, photoComplete, audited to true)
3. Append new sources to `initial-data/photo-sources.md`

Process 10-15 writers per session. Report progress when done.
```

---

## KEY FILES

| File | Purpose |
|------|---------|
| `writers-sample.json` | **Single source of truth** - all 108 writers, update directly |
| `audit-tracker.json` | Tracks which writers have been audited |
| `year-mapping.md` | Maps writers to their appearance year(s) |
| `photo-sources.md` | Documents photo sources and attributions |

---

## PHOTO RESEARCH GUIDELINES

This is a non-commercial educational archive. Photos are publicly available for virtually ALL published writers:

1. **DO search broadly** - Google "[Author Name] writer photo" finds photos for almost everyone
2. **DO use these sources:**
   - Author websites (most writers have one)
   - University faculty pages (for academics)
   - Publisher author pages (Penguin, Macmillan, FSG, etc.)
   - Poetry Foundation, Academy of American Poets
   - MacDowell, Yaddo, Bread Loaf artist pages
   - IMDB (for writer-filmmakers)
   - Literary festival/event pages
3. **DO NOT** mark photos "unavailable" just because they're not on Wikimedia Commons
4. **DO NOT** be overly cautious about licensing - use "press" for official sources
5. **ONLY** mark "unavailable" after genuinely failing to find ANY photo

### CRITICAL: Get Direct Image URLs

**You MUST capture the direct image file URL, not just the webpage URL.**

- `url` = the webpage where you found the photo (for attribution)
- `imageUrl` = the **direct link to the image file** (ends in .jpg, .png, .webp, etc.)

**How to get the direct image URL:**
1. Find the photo on a webpage
2. Right-click the image → "Copy Image Address" or "Open Image in New Tab"
3. The direct URL typically ends in `.jpg`, `.png`, `.webp`, or similar
4. Some URLs have query parameters (e.g., `image.jpg?w=800`) - that's fine

**Examples:**
- Page URL: `https://poetryfoundation.org/poets/john-smith`
- Image URL: `https://cdn.poetryfoundation.org/uploads/poets/john-smith-headshot.jpg`

**Without the `imageUrl` field, photos cannot be downloaded by the processing script.**

---

## WRITER RECORD SCHEMA

When updating a writer in `writers-sample.json`, ensure these fields are complete:

```json
{
  "id": "lastname-firstname",
  "name": "Full Name",
  "years": [2023],
  "genre": "poetry/fiction/nonfiction/criticism",
  "bio": "Brief bio (2-3 sentences)",
  "notableWorks": ["Book 1", "Book 2"],
  "awards": ["Award 1", "Award 2"],
  "wikipediaUrl": "https://en.wikipedia.org/wiki/..." or null,
  "officialWebsite": "https://..." or null,
  "photo": {
    "source": "official/university/press/wikimedia/institution",
    "url": "https://source-page-url-for-attribution",
    "imageUrl": "https://direct-image-file.jpg",
    "license": "press/CC BY 2.0/etc",
    "attribution": "Photographer Name or Source",
    "status": "available/needs_acquisition/unavailable",
    "localPath": "writers/lastname-firstname.webp"
  },
  "confidence": "high/medium/low",
  "needsReview": false
}
```

---

## PHOTO PROCESSING

Photos are downloaded and standardized during the build process:

- **Dimensions:** 400×500px (portrait orientation, 4:5 aspect ratio)
- **Format:** WebP (for web performance)
- **Location:** `public/images/writers/`
- **Naming:** `{writer-id}.webp` (e.g., `ondaatje-michael.webp`)

Run `npm run process-photos` to download and resize all photos with `status: "available"`.

The `localPath` field is populated automatically by the photo processing script.

---

## PROGRESS TRACKING

After each session, update `audit-tracker.json`:
- Set `yearComplete: true` if year was added
- Set `photoComplete: true` if photo was found
- Set `audited: true` when both are complete

The metadata section tracks overall progress automatically based on the writer entries.
