import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Alchemy from "alchemy";
import { adopt } from "alchemy/AdoptPolicy";
import { retain } from "alchemy/RemovalPolicy";
import * as Effect from "effect/Effect";

const website = Effect.gen(function* () {
	const { stage } = yield* Alchemy.Stack;
	if (stage !== "preview" && stage !== "production") {
		return yield* Effect.die(
			new Error("Deploy using the preview or production stage."),
		);
	}
	const isProduction = stage === "production";

	// Production keeps the Worker that wrangler created, and survives a destroy.
	return yield* Cloudflare.Website.Vite("Website", {
		name: isProduction ? "honeyicons" : "honeyicons-preview",
		domain: isProduction ? "honeyicons.com" : undefined,
		compatibility: { date: "2026-09-12" },
		assets: { notFoundHandling: "single-page-application" },
	}).pipe(adopt(isProduction), retain(isProduction));
});

export default Alchemy.Stack(
	"honeyicons",
	{
		providers: Cloudflare.providers(),
		// Its own store, so upgrading Alchemy here can't break the account's other projects.
		state: Cloudflare.state({ workerName: "honeyicons-alchemy-state" }),
	},
	Effect.gen(function* () {
		const { url } = yield* website;
		return { url };
	}),
);
