import "std/dotenv/load";

import { retry } from "std/async";

import { ChatGPTAPI } from "chatgpt";

const {
	cwd,
	env
} = Deno;

const api = new ChatGPTAPI({
	apiKey: env.get("OPENAI_API_KEY")
});

/**
 *
 * @param country
 * @param country.name
 */
const generator = async ({ name }) => {
	const promptLines = [`Describe the flag of ${name}! Provide color codes, aspect ratio, geometric properties and measurements, and any other relevant information! Don't include a symbolic description of the flag's features!`];

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

export default generator;
