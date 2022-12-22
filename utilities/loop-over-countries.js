import { join } from "std/path";
import { optimize as optimizeSvg } from "npm:svgo";

import isSvgValid from "./is-svg-valid.js";
import svgToPng from "./svg-to-png.js";
import simplifySvg from "./simplify-svg.js";

import countries from "https://raw.githubusercontent.com/mledoze/countries/master/countries.json" assert { type: "json" };
import svgoConfig from "../svgo.json" assert { type: "json" };

const {
	args: [
		countryCodesFilterString
	],
	cwd,
	errors: {
		NotFound
	},
	mkdir,
	stat,
	writeTextFile,
} = Deno;

const countryCodesFilter = countryCodesFilterString?.split(",") ?? [];

const loopOverCountries = async (setupName, iteratee) => {
	const sortedCountries = new Set(
		[
			...(
				countryCodesFilter.length > 0
					? countries
						.filter(({ cca3: countryCode }) => countryCodesFilter
							.map((filterCountryCode) => filterCountryCode.toLocaleLowerCase())
							.includes(countryCode.toLocaleLowerCase())
						)
					: countries
			)
				.map(({ name: { common: name }, cca3: countryCode }) => ({ name, countryCode: countryCode.toLocaleLowerCase() }))
		]
			.sort((
				{ countryCode: countryCodeA },
				{ countryCode: countryCodeB },
			) => Intl.Collator().compare(countryCodeA, countryCodeB))
	);

	for (const { name, countryCode } of sortedCountries) {
		const folderPath = join(cwd(), "static", "setups", setupName, countryCode);

		const descriptionFilePath = join(folderPath, "description.txt");
		const svgFlagFilePath = join(folderPath, "flag.svg");
		const pngFlagFilePath = join(folderPath, "flag.png");

		try {
			if (countryCodesFilter.length === 0) {
				let alreadyProcessed = false;

				try {
					await stat(descriptionFilePath);
					await stat(svgFlagFilePath);
					await stat(pngFlagFilePath);

					alreadyProcessed = true;
				}
				catch (error) {
					if (!(error instanceof NotFound)) {
						throw error;
					}
				}

				if (alreadyProcessed) {
					console.log(`Already processed ${name} (${countryCode})`);
					continue;
				}
			}

			console.log(`Processing ${name} (${countryCode})...`);

			const { description, svg } = await iteratee({ name, countryCode });

			await mkdir(folderPath, { recursive: true });

			await writeTextFile(descriptionFilePath, description);

			if (!isSvgValid(svg)) {
				throw new Error(`Invalid SVG code for ${name} (${countryCode})`);
			}

			const { data: optimizedSvg } = optimizeSvg(svg, svgoConfig);

			const simplifiedSvg = simplifySvg(optimizedSvg);

			await writeTextFile(svgFlagFilePath, simplifiedSvg);

			await svgToPng(svgFlagFilePath, pngFlagFilePath);
		}
		catch (error) {
			console.error(`Failed to process ${name} (${countryCode})`);
			console.error(error);
		}
	}
};

export default loopOverCountries;