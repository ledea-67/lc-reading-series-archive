# Writer Data Audit - Start Prompt

Copy and paste this prompt into a new Claude Code window to begin the audit process.

---

## PROMPT

I need to audit and complete the writer data for the Lewis & Clark Reading Series Archive.

### Context

The project is at: `/Users/stephentoutonghi/projects/lewis-clark/author-series`

Key files:
- `initial-data/writers-sample.json` - Current writer data (108 writers, mostly incomplete)
- `initial-data/Lewis-Clark-for-Pauls-Sheet1.pdf` - PDF with year-to-writer mappings
- `initial-data/data-audit-process.md` - Full process documentation
- `initial-data/writer-checklist.md` - Tracking checklist (needs updating)

### The Problem

Most writers have incomplete data:
- `years: [0]` when actual years exist in the PDF
- `photo.status: "needs_acquisition"` when we need to research and find photos
- Writers were marked "done" prematurely

### Your Tasks

**Phase 1: Extract Years from PDF**

1. Read `initial-data/Lewis-Clark-for-Pauls-Sheet1.pdf`
2. Create a file `initial-data/year-mapping.md` that maps each writer to their year(s)
3. The PDF has a grid layout - parse it carefully to extract year-writer associations

**Phase 2: Begin Writer Audit (Batch 1)**

For the first batch of writers (Aamina Ahmad through Arthur Bradford, ~14 writers):

For each writer:
1. Update their `years` field with the actual year from the PDF
2. Research their photo:
   - Search Wikimedia Commons first
   - Check their official website
   - Check publisher press kits
   - Check university faculty pages
3. Update the `photo` object with:
   - `source`: where found (wikimedia/official/press/university)
   - `url`: direct link to the image source page
   - `license`: CC BY 2.0, public domain, fair use, etc.
   - `attribution`: credit line
   - `status`: "available" or "unavailable" (no more "needs_acquisition")

**Output**

After completing Batch 1:
1. Save updated writers to `initial-data/writers-audit-batch1.json` (just the updated entries)
2. Update `initial-data/writer-checklist.md` with accurate status for audited writers
3. Create `initial-data/photo-sources.md` documenting photo research results
4. Report progress and any issues found

### Important Notes

- Use WebSearch and WebFetch to research photos
- Prefer Wikimedia Commons for clear licensing
- If no photo can be found after thorough research, set `status: "unavailable"` (not "needs_acquisition")
- Mark `needsReview: true` only if there's genuine uncertainty about the data
- A writer is only "complete" when they have both year AND photo research done

Please start by reading the PDF and creating the year mapping, then proceed to Batch 1.

---

## After Each Batch

When a batch is complete, use this follow-up prompt:

```
Continue the writer data audit. Complete Batch [N] (writers [First Name] through [Last Name]).

Follow the same process:
1. Update years from the year-mapping
2. Research photos for each writer
3. Save results to writers-audit-batch[N].json
4. Update the checklist
5. Add to photo-sources.md

Report progress when done.
```
