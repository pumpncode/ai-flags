import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "./plugins/twind.ts";
import twindConfig from "./twind.config.js";

import "std/dotenv/load";

await start(manifest, { plugins: [twindPlugin(twindConfig)] });
