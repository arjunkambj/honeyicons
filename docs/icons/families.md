# Icon families

A family shares one base file. Build variants from the base's geometry, and change the base first when the whole family needs to change.

## Symbol variants: add, remove, check, lock, search

Put the symbol inside the frame when it fits with 1.8 clear all round, as `folder-add` does. When it can't fit, as in `file-add`, `calendar-add`, and `image-add`, put it in the bottom-right corner and stop the frame 1.8 clear of it with round caps.

## `*-off` variants

Draw the base unchanged, then add a diagonal slash from top left to bottom right with 1.5 clear on each side. Delete any leftover that doesn't help someone recognise the object. The check allows 4 pieces and no crumbs. `phone-off` runs its slash the other way, top right to bottom left, because the handset lies along the usual direction and little would be left of it. `edit-off` cuts `pen`, because the slash would take the whole tip off the smaller pencil in `edit`.

## Folders

`icons/linear/files/folder.svg` is the base: 21.6 wide and 18 tall, corners 3, tab curves 2, no dash. The strokes run from 2.1 to 21.9 across, with the tab top at 3.9, the body top at 6.9, and the bottom at 20.1.

- Symbols sit inside, centred on 12, 13.5.
- `folder-open` keeps the base's tab, left side, and bottom. Its flap overhangs on the right and its line starts inside the folder. In bold, the flap line becomes the 1.8 gap.
- `folder-with-files` runs the same folder lower, with the tab top at 6.9, the body top at 9.9, and the bottom at 21.9. A sheet with a folded corner stands behind it and stops 1.8 clear.
- `folders` is a front folder with an L-shaped back folder that stops 1.8 clear.
- `folder-tree` is a spine with two identical small folders.

## Files

Gently rounded, with slightly taller page proportions. New variants reuse `icons/linear/files/file.svg`.

## Users

`icons/linear/user/user.svg` is the base, drawn with strokes: a ring head of radius 3.4 at y = 5.5, and a deep closed bust with a flat base at y = 21.9, round shoulders, and a gentle top arch. Reuse its numbers across the family so the figure doesn't change size between variants.

- Status variants move the figure's centre to x = 9.44 and open the bust at x = 13 with round caps, with the head whole. The symbol sits in the bottom-right corner with no badge around it. Bold closes the opening into a flat side 1.8 clear of the symbol with 0.9 corners.
- `UserGroup` is two people: the figure at x = 9.44 in front, and a 0.86-scale figure behind on the right, trimmed 1.8 clear with round caps. In bold, the back pieces are cut 1.8 clear with tips rounded 0.9.

## Phones

`phone`, `incoming-call`, `outgoing-call`, and `phone-off` share one handset. Change it in all of them together.

## Sliders

Handles are perpendicular bars that join the track on one side and leave a clear gap on the other. Main variants have three tracks and Alt variants have two. Horizontal and vertical versions are rotations of the same geometry.

## Arrows

Icons with an arrow, including cloud transfers and import and export, reuse the curved arrowhead. Scale the complete arrowhead and keep its curved tip.

## Spinners

`spinner` and `spinner-arc` are a 1.5 ring drawn as filled outlines, lighter than the 1.8 line on purpose. The check skips spinners because they're made of faint, animated parts, so look at them by eye.
