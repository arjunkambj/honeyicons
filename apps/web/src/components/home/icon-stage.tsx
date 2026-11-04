import { cn } from "@honeyicons/ui/lib/utils";
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	useSyncExternalStore,
} from "react";
import { tintFor, wallTiles } from "./wall";

const TILE = 112;
const ICON = 40;
const COLUMNS = 24;

const TILES = wallTiles;
const ROWS = Math.ceil(TILES.length / COLUMNS);
const CANVAS_W = COLUMNS * TILE;
const CANVAS_H = ROWS * TILE;

const FOCUS_INTERVAL_MS = 4200;
// The first flight leaves soon after load, so the wall is visibly alive at once.
const FIRST_FLIGHT_MS = 1700;
// Start on an icon everyone recognizes, near the middle of the wall.
const START_INDEX = Math.max(
	0,
	TILES.findIndex((item) => item.name === "folder-open"),
);
// A focus change should be a real flight across the wall, never a hop to a neighbor.
const MIN_HOP_TILES = 6;

const clamp = (min: number, value: number, max: number) =>
	Math.min(max, Math.max(min, value));

function center(index: number) {
	return {
		x: (index % COLUMNS) * TILE + TILE / 2,
		y: Math.floor(index / COLUMNS) * TILE + TILE / 2,
	};
}

function tileDistance(a: number, b: number) {
	const from = center(a);
	const to = center(b);
	return Math.hypot(from.x - to.x, from.y - to.y) / TILE;
}

// Slow start, fast middle, slow landing.
const easeInOutCubic = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const flightDuration = (tiles: number) => clamp(1400, 1000 + tiles * 70, 2600);
// Long flights pull back far enough to show the whole wall.
const flightZoomOut = (tiles: number) => clamp(0.3, 0.75 - tiles * 0.03, 0.75);

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
	const media = window.matchMedia(reducedMotionQuery);
	media.addEventListener("change", onChange);
	return () => media.removeEventListener("change", onChange);
}
function usePrefersReducedMotion() {
	return useSyncExternalStore(
		subscribeReducedMotion,
		() => window.matchMedia(reducedMotionQuery).matches,
		() => true,
	);
}

type Camera = { x: number; y: number; zoom: number };

function FocusGrid() {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="absolute inset-0 size-full text-foreground/15"
			fill="none"
			stroke="currentColor"
			strokeWidth={0.04}
		>
			{Array.from({ length: 25 }, (_, i) => (
				<g key={i}>
					<line x1={i} y1={0} x2={i} y2={24} />
					<line x1={0} y1={i} x2={24} y2={i} />
				</g>
			))}
			<rect
				x={1.2}
				y={1.2}
				width={21.6}
				height={21.6}
				rx={2}
				strokeWidth={0.08}
				strokeDasharray="0.4 0.4"
				className="text-foreground/40"
			/>
		</svg>
	);
}

/**
 * The whole set as one wall of tiles. A camera flies from icon to icon: it
 * pulls back to show the wall mid-flight, lands close on one icon, lays its
 * drawing grid over it, and then switches it from linear to bold.
 */
export function IconStage({ className }: { className?: string }) {
	const viewportRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLDivElement>(null);
	const cameraRef = useRef<Camera | null>(null);
	const activeRef = useRef(START_INDEX);
	const flownRef = useRef(false);
	const [viewport, setViewport] = useState({ w: 0, h: 0 });
	const [active, setActive] = useState(START_INDEX);
	const [boldIndex, setBoldIndex] = useState<number | null>(null);
	const [hovered, setHovered] = useState(false);
	const [hidden, setHidden] = useState(false);
	const reducedMotion = usePrefersReducedMotion();

	useEffect(() => {
		const element = viewportRef.current;
		if (!element) return;
		const measure = () =>
			setViewport({ w: element.clientWidth, h: element.clientHeight });
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const update = () => setHidden(document.hidden);
		document.addEventListener("visibilitychange", update);
		return () => document.removeEventListener("visibilitychange", update);
	}, []);

	function focusTile(next: number) {
		activeRef.current = next;
		setActive(next);
	}

	useEffect(() => {
		if (reducedMotion || hovered || hidden) return;
		let timer = 0;
		const fly = (delay: number) => {
			timer = window.setTimeout(() => {
				const current = activeRef.current;
				let next = current;
				while (tileDistance(next, current) < MIN_HOP_TILES) {
					next = Math.floor(Math.random() * TILES.length);
				}
				activeRef.current = next;
				flownRef.current = true;
				setActive(next);
				fly(FOCUS_INTERVAL_MS);
			}, delay);
		};
		fly(flownRef.current ? FOCUS_INTERVAL_MS : FIRST_FLIGHT_MS);
		return () => window.clearTimeout(timer);
	}, [reducedMotion, hovered, hidden]);

	const measured = viewport.w > 0 && viewport.h > 0;
	// Show about six tiles across the shorter side, so a view holds a crowd of icons.
	const focusScale = measured
		? clamp(0.9, Math.min(viewport.w, viewport.h) / 6 / TILE, 1.8)
		: 1.4;

	useLayoutEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !measured) return;
		const target = { ...center(active) };

		// Keep the view inside the wall so no empty space shows at the edges.
		const fit = (offset: number, view: number, size: number) =>
			size <= view ? (view - size) / 2 : clamp(view - size, offset, 0);
		const apply = ({ x, y, zoom }: Camera) => {
			const s = focusScale * zoom;
			const tx = fit(viewport.w / 2 - x * s, viewport.w, CANVAS_W * s);
			const ty = fit(viewport.h / 2 - y * s, viewport.h, CANVAS_H * s);
			canvas.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
			cameraRef.current = { x, y, zoom };
		};

		const from = cameraRef.current;
		const tiles = from
			? Math.hypot(target.x - from.x, target.y - from.y) / TILE
			: 0;
		if (!from || reducedMotion || tiles < 0.01) {
			apply({ ...target, zoom: 1 });
			canvas.style.opacity = "1";
			// On load the first icon turns bold right away, before the first flight.
			if (reducedMotion) return;
			const boldTimer = window.setTimeout(() => setBoldIndex(active), 600);
			return () => window.clearTimeout(boldTimer);
		}

		const duration = flightDuration(tiles);
		const zoomOut = flightZoomOut(tiles);
		const start = performance.now();
		let frame = 0;
		// Scale a cached layer while flying instead of redrawing every icon on
		// every frame, then drop the layer so the icons render crisp on landing.
		canvas.style.willChange = "transform";
		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / duration);
			const eased = easeInOutCubic(t);
			// A flight cut short mid-zoom recovers its zoom along the way.
			const baseZoom = from.zoom + (1 - from.zoom) * eased;
			const dip = 1 - (1 - zoomOut) * Math.sin(Math.PI * t) ** 2;
			apply({
				x: from.x + (target.x - from.x) * eased,
				y: from.y + (target.y - from.y) * eased,
				zoom: baseZoom * dip,
			});
			if (t < 1) frame = requestAnimationFrame(tick);
			else canvas.style.willChange = "auto";
		};
		frame = requestAnimationFrame(tick);
		// Once the camera has landed and the grid is up, switch to bold.
		const boldTimer = window.setTimeout(
			() => setBoldIndex(active),
			duration + 900,
		);
		return () => {
			cancelAnimationFrame(frame);
			window.clearTimeout(boldTimer);
			canvas.style.willChange = "auto";
		};
	}, [active, measured, reducedMotion, focusScale, viewport.w, viewport.h]);

	return (
		<div
			ref={viewportRef}
			aria-hidden="true"
			className={cn("overflow-hidden", className)}
			onPointerEnter={(event) => {
				if (event.pointerType === "mouse") setHovered(true);
			}}
			onPointerLeave={() => setHovered(false)}
		>
			<div
				ref={canvasRef}
				className="absolute top-0 left-0 grid origin-top-left border-border border-t border-l opacity-0"
				style={{
					width: CANVAS_W,
					height: CANVAS_H,
					gridTemplateColumns: `repeat(${COLUMNS}, ${TILE}px)`,
					gridAutoRows: TILE,
				}}
			>
				{TILES.map((item, index) => {
					const Component = item.component;
					const focused = index === active;
					const variant = focused && boldIndex === index ? "bold" : "linear";
					return (
						<div
							key={item.name}
							onClick={() => focusTile(index)}
							className={cn(
								"relative flex cursor-pointer items-center justify-center border-border border-r border-b transition-colors duration-500 [contain:layout_style]",
								focused
									? "z-10 bg-card shadow-[0_6px_24px_-10px_rgb(0_0_0/0.10),0_1px_2px_rgb(0_0_0/0.04)]"
									: (tintFor(index) ?? "text-foreground/75"),
								!focused && "hover:bg-card",
							)}
						>
							<span className="relative" style={{ width: ICON, height: ICON }}>
								{focused && <FocusGrid />}
								<Component variant={variant} size={ICON} className="relative" />
							</span>
							{focused && (
								<span className="absolute inset-x-0 bottom-2 truncate px-2 text-center font-mono text-[9px] text-muted-foreground">
									{item.name} · {variant}
								</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
