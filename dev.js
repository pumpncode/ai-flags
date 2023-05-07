#!/usr/bin/env -S deno run -A --unstable --watch=static/,routes/

import dev from "$fresh/dev.ts";

import "std/dotenv/load";

import tailwindCSS from "./tailwind.js";
import tailwindConfig from "./tailwind.config.js";

await tailwindCSS({
	...tailwindConfig
});

await dev(import.meta.url, "./main.js");
