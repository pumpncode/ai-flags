import "std/dotenv/load";

import { Temporal } from "npm:@js-temporal/polyfill";
import { ChatGPTAPI } from "npm:chatgpt";
import { retry } from "std/async";

import snakeCaseObject from "../snake-case-object.js";

const {
	env
} = Deno;

const {
	Duration
} = Temporal;

const defaultCompletionParams = snakeCaseObject({
	model: "gpt-4"
});

/**
 *
 * @param options
 * @param options.completionParams
 */
const gpt4 = ({ completionParams = defaultCompletionParams } = { completionParams: defaultCompletionParams }) => {
	const currentCompletionParams = completionParams === defaultCompletionParams
		? completionParams
		: {
			...defaultCompletionParams,
			...completionParams
		};

	const tokenLimit = 8_192;

	const charactersPerToken = 2;

	const api = new ChatGPTAPI({
		apiKey: env.get("OPENAI_API_KEY"),
		completionParams: currentCompletionParams
	});

	const timeout = Duration.from({ minutes: 2 });

	const timeoutMilliseconds = timeout.total("milliseconds");

	return async ({ name }) => {
		const vexillologistPromptLines = [`Describe the flag of ${name}! Provide color codes, aspect ratio, geometric properties and measurements, and any other relevant information! Don't include a description of the flag's symbolism!`];

		const vexillologistPrompt = vexillologistPromptLines.join("\n");

		const vexillographerPromptLines = ["Please give me a precise SVG markup for that flag!"];

		const vexillographerPrompt = vexillographerPromptLines.join("\n");

		const maxTokens = Math.floor(
			tokenLimit -
			(
				vexillologistPrompt.length /
				charactersPerToken
			)
		);

		const {
			text: descriptionResponse,
			id: parentMessageId
		} = await retry(
			async () => api.sendMessage(
				vexillologistPrompt,
				{
					timeoutMs: timeoutMilliseconds,
					completionParams: {
						...currentCompletionParams,
						...snakeCaseObject({
							maxTokens
						})
					}
				}
			)
		);

		const description = descriptionResponse.trim();

		console.log("description");
		console.log(description);

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

		const {
			text: svgResponse
		} = await retry(
			async () => api.sendMessage(
				vexillographerPrompt,
				{
					timeoutMs: timeoutMilliseconds,
					parentMessageId,
					completionParams: {
						...currentCompletionParams,
						...snakeCaseObject({
							maxTokens: newMaxTokens
						})
					}
				}
			)
		);

		const svg = svgResponse.trim().replace(/^(?:.|\n)*?(<svg(?:.|\n)*?<\/svg>)(?:.|\n)*?$/, "$1");

		return {
			description,
			svg
		};
	};
};

export default gpt4;
