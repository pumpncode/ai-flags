import "std/dotenv/load";

import { Temporal } from "npm:@js-temporal/polyfill";
import { ChatGPTAPI } from "npm:chatgpt";
import { retry } from "std/async";

import { snakeCaseObject } from "@ai-flags/utilities";

const {
	env
} = Deno;

const {
	Duration
} = Temporal;

const tokenLimit = 4_096;

const charactersPerToken = 2;

const completionParams = snakeCaseObject({
	model: "gpt-3.5-turbo-0301"
});

const api = new ChatGPTAPI({
	apiKey: env.get("OPENAI_API_KEY"),
	completionParams
});

const timeout = Duration.from({ minutes: 2 });

const timeoutMilliseconds = timeout.total("milliseconds");

/**
 *
 * @param country
 * @param country.name
 */
const generator = async ({ name }) => {
	const vexillologistPromptLines = [`Describe the flag of ${name}! Provide color codes, aspect ratio, geometric properties and measurements, and any other relevant information! Don't include a symbolic description of the flag's features!`];

	const vexillologistPrompt = vexillologistPromptLines.join("\n");

	const vexillographerPromptLines = ["Please give me a precise SVG markup for that flag, using the `xmlns` and `viewBox` attributes and only integers for all number values if possible, otherwise use decimals!"];

	const vexillographerPrompt = vexillographerPromptLines.join("\n");

	const maxTokens = Math.floor(
		tokenLimit -
		(
			vexillologistPrompt.length /
			charactersPerToken
		)
	);

	api._completionParams = {
		...api._completionParams,
		...snakeCaseObject({
			maxTokens
		})
	};

	const {
		text: descriptionResponse,
		id: parentMessageId
	} = await retry(
		async () => api.sendMessage(
			vexillologistPrompt,
			{
				timeoutMs: timeoutMilliseconds
			}
		)
	);

	const description = descriptionResponse.trim();

	const newMaxTokens = Math.floor(
		tokenLimit -
		(
			(
				vexillologistPrompt.length +
				description.length
			) /
			charactersPerToken
		)
	);

	api._completionParams = {
		...api._completionParams,
		...snakeCaseObject({
			maxTokens: newMaxTokens
		})
	};

	const {
		text: svgResponse
	} = await retry(
		async () => api.sendMessage(
			vexillographerPrompt,
			{
				timeoutMs: timeoutMilliseconds,
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
