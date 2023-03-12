import { join } from "std/path";
import { optimize as optimizeSvg } from "svgo";

import isSvgValid from "./is-svg-valid.js";
import simplifySvg from "./simplify-svg.js";
import svgToPng from "./svg-to-png.js";

import countries from "https://raw.githubusercontent.com/mledoze/countries/master/countries.json" assert { type: "json" };

const svgoConfig = {
	multipass: true,
	js2svg: {
		pretty: true,
		indent: "\t"
	},
	plugins: [
		"preset-default",
		{
			name: "removeViewBox",
			active: false
		}
	]
};

const {
	args: [
		codesFilterString
	],
	cwd,
	errors: {
		NotFound
	},
	mkdir,
	stat,
	writeTextFile,
} = Deno;

const codesFilter = codesFilterString?.split(",") ?? [];

const processCountry = async ({ name, officialName, code }) => {
	const folderPath = join(cwd(), "static", "setups", setupName, code);

	const descriptionFilePath = join(folderPath, "description.md");
	const svgFlagFilePath = join(folderPath, "flag.svg");
	const pngFlagFilePath = join(folderPath, "flag.png");

	try {
		if (codesFilter.length === 0) {
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
				throw new Error(`Already processed ${name} (${code})`);
			}
		}

		console.log(`Processing ${name} (${code})...`);

		const { description, svg } = await iteratee({ name, code });

		await mkdir(folderPath, { recursive: true });

		await writeTextFile(descriptionFilePath, description);

		if (!isSvgValid(svg)) {
			throw new Error(`Invalid SVG code for ${name} (${code})`);
		}

		const { data: optimizedSvg } = optimizeSvg(svg, svgoConfig);

		const simplifiedSvg = simplifySvg(optimizedSvg);

		await writeTextFile(svgFlagFilePath, simplifiedSvg);

		await svgToPng(svgFlagFilePath, pngFlagFilePath);
	}
	catch (error) {
		console.error(`Failed to process ${name} (${code})`);
		console.error(error);
	}
}

const loopOverCountries = async (setupName, iteratee) => {
	const sortedCountries = new Set(
		[
			...(
				codesFilter.length > 0
					? countries
						.filter(({ cca3: code }) => codesFilter
							.map((filterCode) => filterCode.toLocaleLowerCase())
							.includes(code.toLocaleLowerCase())
						)
					: countries
			)
				.map(({ name: { common: name, official: officialName }, cca3: code }) => ({ name, officialName, code: code.toLocaleLowerCase() }))
		]
			.sort((
				{ code: codeA },
				{ code: codeB },
			) => Intl.Collator().compare(codeA, codeB))
	);

	for (const { name, officialName, code } of sortedCountries) {
		const folderPath = join(cwd(), "static", "setups", setupName, code);

		const descriptionFilePath = join(folderPath, "description.md");
		const svgFlagFilePath = join(folderPath, "flag.svg");
		const pngFlagFilePath = join(folderPath, "flag.png");

		try {
			if (codesFilter.length === 0) {
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
					console.log(`Already processed ${name} (${code})`);
					continue;
				}
			}

			console.log(`Processing ${name} (${code})...`);

			const { description, svg } = await iteratee({ name, code });

			await mkdir(folderPath, { recursive: true });

			await writeTextFile(descriptionFilePath, description);

			if (!isSvgValid(svg)) {
				throw new Error(`Invalid SVG code for ${name} (${code})`);
			}

			const { data: optimizedSvg } = optimizeSvg(svg, svgoConfig);

			const simplifiedSvg = simplifySvg(optimizedSvg);

			await writeTextFile(svgFlagFilePath, simplifiedSvg);

			await svgToPng(svgFlagFilePath, pngFlagFilePath);
		}
		catch (error) {
			console.error(`Failed to process ${name} (${code})`);
			console.error(error);
		}
	}
};

export default loopOverCountries;