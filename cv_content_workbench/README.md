# CV Content Workbench

This directory is a temporary editing workspace for the interactive CV content.
It is intentionally tracked by git so manual drafts, image choices, and future
agent integration work stay visible in diffs.

## Structure

- `daggers/` contains inline dagger notes rendered by `Sidenote.astro`.
- `modals/` contains hover-card previews rendered by `HoverCard.astro`.
- `popups/` contains Linux-style role windows rendered by `Window.astro`.

Each content target has its own folder and a `content.md` file. Add replacement
copy directly in that file. If a target needs screenshots, images, charts, or
other supporting media, place those files in the same folder as `content.md` and
reference them by filename in the "Media" section.

## Integration Contract

When the final version is ready, a future agent should:

1. Read every `content.md` file in this workbench.
2. Replace the corresponding placeholder in `src/pages/index.astro`.
3. Copy any referenced media into an appropriate served location, likely
   `public/images/cv/`, preserving clear filenames.
4. Update the relevant component markup to include images only where requested.
5. Keep the existing interaction model:
   - daggers expand inline and affect vertical layout only after click;
   - modals appear on hover/focus only and do not pin on click;
   - popups use the existing Linux window aesthetic.
6. Run `npm run build`.
7. Leave this workbench in place unless Paul explicitly asks to remove it.

## Editing Notes

Do not worry about exact HTML while drafting. Plain Markdown prose is enough.
If you want a specific image, add it to the item folder and mention where it
should appear. If you want a link, paste the URL inline.
