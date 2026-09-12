# Project instructions

- Do not write tests unless the user explicitly asks for them.
- Write idiomatic TypeScript and follow the existing project conventions.
- Create linear icons by default. Only create bold, duotone, or other icon styles when the user explicitly requests them.

## Icon design standards

- Every icon must be clear, balanced, and recognizable at both 16px and 24px. Review icons together at their actual rendered sizes before considering a design finished.
- When standardizing existing icons, preserve their silhouette and proportions. Do not redesign the shape unless the user explicitly requests it.
- Use a consistent `viewBox="0 0 24 24"`. Design for both target sizes from the start; simplify details and open up tight gaps that become muddy at 16px.
- Use a standard stroke weight of 1.5 units on the 24-unit grid, matching the renderer default. With normal scaling, this renders at 1px at 16px and 1.5px at 24px. Do not introduce per-icon stroke weights or non-scaling strokes by default.
- Use round line caps and round line joins. Keep comparable corners consistently rounded across the set; use a 2-unit radius as the starting point for rectangular corners, with optical adjustments for the shape.
- Match perceived weight, padding, visual size, and optical centering across icons. A shared viewBox alone does not guarantee a consistent appearance.
- Filled outlines must visually match the same stroke and rounding standards. Their weight and corners are baked into the paths; changing SVG stroke props does not normalize them. Do not add a second stroke over a filled outline.
- Preserve recognizable brand geometry for social icons such as X and Snapchat. Match their optical size and balance with the set without forcing rounded corners onto the brand marks.
