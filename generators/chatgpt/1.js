import "std/dotenv/load";

import { loopOverCountries } from "@ai-flags/utilities";
import { ChatGPTAPI } from "npm:chatgpt";
import { retry } from "std/async";
import { fromFileUrl } from "std/path";

const {
	cwd,
	env
} = Deno;

const api = new ChatGPTAPI({
	apiKey: env.get("OPENAI_API_KEY")
});

const moduleFilePath = fromFileUrl(import.meta.url);

const setupName = moduleFilePath.replace(cwd(), "").replace(/^\/generators\//, "").replace(/\.js$/, "");

const generator = async ({ name }) => {
	const promptLines = [
		`Describe the flag of ${name}! Provide color codes, aspect ratio, geometric properties and measurements, and any other relevant information! Don't include a symbolic description of the flag's features!`,
	];

	const {
		text: descriptionResponse,
		id: parentMessageId
	} = await retry(
		async () => api.sendMessage(
			promptLines.join("\n"),
			{
				timeoutMs: 2 * 60 * 1000
			}
		)
	);

	const description = descriptionResponse.trim();

	const {
		text: svgResponse
	} = await retry(
		async () => api.sendMessage(
			"Please give me a precise SVG markup for that flag, using the `xmlns` and `viewBox` attributes and only integers for all number values if possible, otherwise use decimals!",
			{
				timeoutMs: 2 * 60 * 1000,
				parentMessageId
			}
		)
	);

	const svg = svgResponse.trim().replace(/^(?:.|\n)*?(<svg(?:.|\n)*?<\/svg>)(?:.|\n)*?$/, "$1");

	return {
		description,
		svg
	};
};

await loopOverCountries(setupName, generator);
