import "std/dotenv/load";

import { fromFileUrl } from "std/path";
import { ChatGPTAPI } from "npm:chatgpt";

import { loopOverCountries } from "@ai-flags/utilities";
import { retry } from "std/async";

const {
	cwd,
	env
} = Deno;

const api = new ChatGPTAPI({
	clearanceToken: env.get("CHATGPT_CLEARANCE_TOKEN"),
	sessionToken: env.get("CHATGPT_SESSION_TOKEN"),
	userAgent: env.get("USER_AGENT")
});

await api.ensureAuth();

const moduleFilePath = fromFileUrl(import.meta.url);

const setupName = moduleFilePath.replace(cwd(), "").replace(/^\/generators\//, "").replace(/\.js$/, "");

const generator = async ({ name }) => {
	const promptLines = [
		"The following is a conversation with an expert vexillologist. They know all of the flags of the world, can describe them to you in detail and tell you their aspect ratio. They answer with a precise geometrical description of the flag.",
		"\n",
		`Me: Describe the flag of ${name}.`,
		"Vexillologist:",
	];

	const description = (
		await retry(
			async () => api.sendMessage(
				promptLines.join("\n"),
				{
					timeoutMs: 2 * 60 * 1000
				}
			)
		)
	)
		.trim();

	const svg = (
		await retry(
			async () => api.sendMessage(
				`${description} Here is SVG code (with a viewBox attribute) for it:`,
				{
					timeoutMs: 2 * 60 * 1000
				}
			)
		)
	)
		.trim()
		.replace(/^(?:.|\n)*?(<svg(?:.|\n)*?<\/svg>)(?:.|\n)*?$/, "$1");

	return { description, svg };
}

await loopOverCountries(setupName, generator);