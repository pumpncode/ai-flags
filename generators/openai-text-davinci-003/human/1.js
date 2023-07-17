import "std/dotenv/load";

import { join } from "std/path";

const {
	cwd,
	readTextFile
} = Deno;

/**
 *
 * @param country
 * @param country.code
 * @param options
 * @param options.setupName
 */
const generator = async ({ code }, { setupName }) => {
	const folderPath = join(cwd(), "data", "vexillologists", setupName, code);

	const descriptionFilePath = join(folderPath, "description.md");
	const svgFlagFilePath = join(folderPath, "flag.svg");

	const description = await readTextFile(descriptionFilePath);
	const svg = await readTextFile(svgFlagFilePath);

	return {
		description,
		svg
	};
};

export default generator;
