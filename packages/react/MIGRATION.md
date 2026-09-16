# Icon naming migration

Canonical icon names now describe their shapes and use descriptive kebab-case SVG filenames. React exports use PascalCase. All 164 icons retain their geometry and available variants.

## Arrow imports require attention

The old `ArrowDown`, `ArrowUp`, `ArrowLeft`, and `ArrowRight` exports depicted chevrons. Use `ChevronDown`, `ChevronUp`, `ChevronLeft`, and `ChevronRight` to preserve those shapes. The `Arrow*` names now depict arrows with shafts, previously named `Arrow*02`. Diagonal arrows are unchanged.

All other renamed exports remain available as deprecated aliases. The catalog lists only canonical names, and old filenames and component names remain searchable. Existing app and shared UI imports have been migrated to preserve their displayed shapes.

## Renamed exports

| Previous export    | Canonical export   |
| ------------------ | ------------------ |
| `ArrowDown`        | `ChevronDown`      |
| `ArrowDown02`      | `ArrowDown`        |
| `ArrowDownDouble`  | `ChevronsDown`     |
| `ArrowLeft`        | `ChevronLeft`      |
| `ArrowLeft02`      | `ArrowLeft`        |
| `ArrowLeftDouble`  | `ChevronsLeft`     |
| `ArrowRight`       | `ChevronRight`     |
| `ArrowRight02`     | `ArrowRight`       |
| `ArrowRightDouble` | `ChevronsRight`    |
| `ArrowUp`          | `ChevronUp`        |
| `ArrowUp02`        | `ArrowUp`          |
| `ArrowUpDouble`    | `ChevronsUp`       |
| `Calendar03`       | `Calendar`         |
| `CheckCheck`       | `CheckDouble`      |
| `Danger`           | `AlertTriangle`    |
| `Edit01`           | `Edit`             |
| `Exit`             | `DoorOpen`         |
| `Folder01`         | `Folder`           |
| `Hamburger`        | `Menu`             |
| `Headphone`        | `Headphones`       |
| `Images`           | `Image`            |
| `ImagesAdd`        | `ImageAdd`         |
| `Insta`            | `Instagram`        |
| `LockUnlock`       | `LockOpen`         |
| `MsCopilot`        | `MicrosoftCopilot` |
| `Muted`            | `VolumeOff`        |
| `Pallet`           | `Archive`          |
| `SearchMinus`      | `ZoomOut`          |
| `SearchPlus`       | `ZoomIn`           |
| `SendMessage`      | `SquarePen`        |
| `SpinnerLarge`     | `SpinnerArc`       |
| `SpinnerTinker`    | `SpinnerWave`      |
| `Ts`               | `Typescript`       |
| `Videocamera`      | `VideoCamera`      |
| `Volume`           | `VolumeLow`        |
| `VolumeLoud`       | `VolumeHigh`       |

SVG filenames follow the same mapping in kebab-case, for example `send-message.svg` becomes `square-pen.svg`.
