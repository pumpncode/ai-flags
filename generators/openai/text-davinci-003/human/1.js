import "std/dotenv/load";

import { fromFileUrl, join } from "std/path";
import { loopOverCountries } from "@ai-flags/utilities";

const {
	cwd,
	readTextFile
} = Deno;

const moduleFilePath = fromFileUrl(import.meta.url);

const setupName = moduleFilePath.replace(cwd(), "").replace(/^\/generators\//, "").replace(/\.js$/, "");

const generator = async ({ code }) => {
	const folderPath = join(cwd(), "static", "setups", setupName, code);

	const descriptionFilePath = join(folderPath, "description.md");
	const svgFlagFilePath = join(folderPath, "flag.svg");

	const description = await readTextFile(descriptionFilePath);
	const svg = await readTextFile(svgFlagFilePath);

	return { description, svg };
};

await loopOverCountries(setupName, generator);