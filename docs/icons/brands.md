# Brand logos

Add a brand only when the user names it.

## Logos

- Ship every brand in both style folders. A solid official mark uses one drawing in both. Only a mark with a genuine line form gets its own linear drawing, as Instagram, Snapchat, Figma, and Meta do; bold keeps the filled logo.
- Keep official geometry. Corners and proportions stay as the brand drew them, and the check measures only placement.
- Draw a ribbon mark's line form, like Meta's, as one 1.8 line along the official mark's centreline, scaled so its outer edge meets the bold mark's footprint.
- When a mark's pieces overlap and only color tells them apart, as in Google Ads, the mono drawing keeps the front pieces whole and trims the back piece 1.5 clear of them. The color drawing keeps the official overlap.

## Color logos

- A brand whose official mark has color also ships `<name>-color` (for example `claude-ai-color`) in both style folders, with one drawing shared by linear and bold. Only `instagram-color` differs by style, following the two mono Instagram drawings. Monochrome marks such as X, GitHub, OpenAI, and Vercel get no color version.
- Build it on the mono icon's geometry and footprint so the two swap without shifting. Paint the official colors onto the existing paths, and split multi-color marks along the brand's own color boundaries. Use the official artwork directly only where it lines up with our silhouette.
- Where two colors meet, run the piece painted first 1.5 under the next one, inside that piece's area, so no seam shows. Draw cutouts the official mark shows in white, like YouTube's play button or Facebook's f, as white shapes over the filled container. Real holes stay transparent.
- Neutral parts the brand flips on dark backgrounds, like the TikTok note and the Kimi tile, use `currentColor`. Black outlines that belong to the artwork, like Snapchat's and Bun's, stay black.
- Gradients, masks, and filters are fine. Prefix every id with the icon name. The build checks that each `url(#id)` resolves, and `IconBase` scopes ids per rendered icon.
