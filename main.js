import prefetchPlugin from "prefetch";

import manifest from "./fresh.gen.ts";
import twindPlugin from "./plugins/twind.ts";
import twindConfig from "./twind.config.js";

import { start } from "$fresh/server.ts";

import "std/dotenv/load";

await start(
	manifest,
	{
		plugins: [twindPlugin(twindConfig), prefetchPlugin({ throttle: 4 })]
	}
);
