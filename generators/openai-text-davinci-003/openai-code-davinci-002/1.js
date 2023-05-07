import "std/dotenv/load";

import fetchAdapter from "@haverstack/axios-fetch-adapter";
import { Configuration, OpenAIApi } from "openai";
import { retry } from "std/async";

const {
	cwd,
	env
} = Deno;

const configuration = new Configuration({
	apiKey: env.get("OPENAI_API_KEY"),
	baseOptions: {
		adapter: (...params) => {
			console.log("params");
			console.log(params);

			return fetchAdapter(...params);
		}
	}
});

const openAiClient = new OpenAIApi(configuration);

/**
 *
 * @param country
 * @param country.name
 */
const generator = async ({ name }) => {
	const descriptionPromptLines = [
		"The following is a conversation with an expert vexillologist. They know all of the flags of the world, can describe them to you in detail and tell you their aspect ratio. They answer with a precise geometrical description of the flag.",
		"\n",
		`Me: Describe the flag of ${name}.`,
		"Vexillologist:"
	];

	const { data: { choices: [{ text: descriptionResponse }] } } = await retry(
		async () => openAiClient.createCompletion({
			model: "text-davinci-003",
			prompt: descriptionPromptLines.join("\n"),
			stop: "\n",
			max_tokens: 2 ** 10
		})
	);

	const description = descriptionResponse.trim();

	const svgPromptLines = [
		`// ${description.trim()} Here is a precise visualization of it in the form of SVG code:`,
		"\n",
		"const html = `",
		"\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox"
	];

	const { data: { choices: [{ text: svgResponse }] } } = await retry(
		async () => openAiClient.createCompletion({
			model: "code-davinci-002",
			prompt: svgPromptLines.join("\n"),
			stop: "</svg>",
			max_tokens: 2 ** 11,
			echo: true
		})
	);

	const svg = `${svgResponse.trim()}</svg>`.replace(/^(?:.|\n)*?(<svg(?:.|\n)*?<\/svg>)(?:.|\n)*?$/, "$1");

	return {
		description,
		svg
	};
};

export default generator;
