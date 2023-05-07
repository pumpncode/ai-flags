import prefetchPlugin from "prefetch";

import manifest from "./fresh.gen.ts";

import { start } from "$fresh/server.ts";

import "std/dotenv/load";

await start(
	manifest,
	{
		plugins: [prefetchPlugin({ throttle: 4 })]
	}
);
