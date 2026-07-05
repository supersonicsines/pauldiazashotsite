# CV Content Workbench

This directory is a tracked drafting workspace for future interactive CV
content. The production homepage content now lives directly in
`src/pages/index.astro`; this folder is for replacement prose, media ideas, and
future agent-assisted editing passes.

## Structure

- `daggers/` contains inline dagger notes rendered by `Sidenote.astro`.
- `modals/` contains hover-card previews rendered by `HoverCard.astro`.
- `popups/` contains retro desktop windows rendered by `Window.astro`,
  including fixed URL-preview windows where noted.

Each content target has its own folder and a `content.md` file. Add replacement
copy directly in that file. If a target needs screenshots, images, charts, or
other supporting media, place those files in the same folder as `content.md` and
reference them by filename in the "Media" section.

## Integration Contract

Some workbench drafts may already be integrated or superseded by the current
homepage. When a draft in this workbench is approved, a future agent should:

1. Read the relevant `content.md` file in this workbench.
2. Replace the corresponding placeholder in `src/pages/index.astro`.
3. Copy any referenced media into an appropriate served location, likely
   `public/images/cv/`, preserving clear filenames.
4. Update the relevant component markup to include images only where requested.
5. Keep the existing interaction model:
   - daggers expand inline and affect vertical layout only after click;
   - hover cards appear on hover/focus;
   - desktop windows use the existing retro window aesthetic;
   - mobile/coarse-pointer windows become inline expanded content.
6. Run `npm run build`.
7. Leave this workbench in place unless Paul explicitly asks to remove it.

## Editing Notes

Do not worry about exact HTML while drafting. Plain Markdown prose is enough.
If you want a specific image, add it to the item folder and mention where it
should appear. If you want a link, paste the URL inline.
