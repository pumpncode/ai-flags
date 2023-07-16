import { Command } from "cliffy";
import { join } from "std/path";

import loopOverCountries from "./generate/loop-over-countries.js";

const {
	args,
	cwd,
	errors: {
		NotFound
	},
	stat
} = Deno;

const allCountries = await (await fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")).json();

const { options: { setups, countries } } = await new Command()
	.name("generate")
	.version("0.1.0")
	.description("Generate flags from setups and generators")
	.option(
		"-s, --setups <setups:string>",
		"comma-separated setups to use, a list of setup strings including the instance name at the end",
		{ required: true }
	)
	.option(
		"-c, --countries [countries:string]",
		"comma-separated list of ISO 3166-1 alpha-3 country codes to use, if not provided all countries will be used"
	)
	.parse(args);

const { setups: fullSetupNames, countries: countryCodes } = {
	setups: setups.split(","),
	countries: (countries ? countries.split(",") : allCountries.map(({ cca3: code }) => code)).map((code) => code.toLowerCase())
};

const setupsFolderPath = join(cwd(), "setups");
const generatorsFolderPath = join(cwd(), "generators");

for (const fullSetupName of fullSetupNames) {
	const setupNameParts = fullSetupName.split("/");

	const instanceName = fullSetupName.at(-1);

	const setupName = setupNameParts.slice(0, -1).join("/");

	const setupFolderPath = join(setupsFolderPath, setupName);

	const descriptionFilePath = join(setupFolderPath, "description.md");

	try {
		await stat(descriptionFilePath);
	}
	catch (error) {
		if (error instanceof NotFound) {
			throw new Error(`Description for setup "${setupName}" could not be found at "${descriptionFilePath}"`);
		}

		throw error;
	}

	const generatorFilePath = join(generatorsFolderPath, `${setupName}.js`);

	try {
		await stat(generatorFilePath);

		const { default: generator } = await import(generatorFilePath);

		await loopOverCountries(fullSetupName, countryCodes, generator);
	}
	catch (error) {
		if (error instanceof NotFound) {
			throw new Error(`Generator for setup "${setupName}" could not be found at "${generatorFilePath}"`);
		}

		throw error;
	}
}
