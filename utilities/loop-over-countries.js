import { join } from "std/path";
import { optimize as optimizeSvg } from "svgo";

import isCompletelyTransparent from "./is-completely-transparent.js";
import isSvgValid from "./is-svg-valid.js";
import simplifySvg from "./simplify-svg.js";
import svgToPng from "./svg-to-png.js";

const countries = await (await fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")).json();

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
	cwd,
	errors: {
		NotFound
	},
	mkdir,
	stat,
	writeTextFile
} = Deno;

/**
 *
 * @param setupName
 * @param countryCodes
 * @param iteratee
 */
// eslint-disable-next-line max-statements
const loopOverCountries = async (setupName, countryCodes, iteratee) => {
	const setupLogger = (...data) => console.log(`[${setupName}]`, ...data);

	const sortedCountries = new Set(
		[
			...countries
				.filter(({ cca3: code }) => countryCodes
					.includes(code.toLowerCase()))
				.map(({ name: { common: name, official: officialName }, cca3: code }) => ({
					name,
					officialName,
					code: code.toLowerCase()
				}))
		]
			.sort((
				{ code: codeA },
				{ code: codeB }
			) => (new Intl.Collator()).compare(codeA, codeB))
	);

	for (const {
		name,
		officialName,
		code
	} of sortedCountries) {
		const folderPath = join(cwd(), "static", "setups", setupName, code);

		const descriptionFilePath = join(folderPath, "description.md");
		const svgFlagFilePath = join(folderPath, "flag.svg");
		const pngFlagFilePath = join(folderPath, "flag.png");

		try {
			let alreadyProcessed = false;

			const completelyTransparentErrorMessage = `[${setupName}] Completely transparent PNG for ${name} (${code})`;

			try {
				await stat(descriptionFilePath);
				await stat(svgFlagFilePath);
				await stat(pngFlagFilePath);

				if (await isCompletelyTransparent(pngFlagFilePath)) {
					throw new Error(completelyTransparentErrorMessage);
				}

				alreadyProcessed = true;
			}
			catch (error) {
				if (
					!(error instanceof NotFound) &&
					error.message !== completelyTransparentErrorMessage
				) {
					throw error;
				}
			}

			if (alreadyProcessed) {
				setupLogger(`Already processed ${name} (${code})`);
				continue;
			}

			setupLogger(`Processing ${name} (${code})...`);

			const { description, svg } = await iteratee(
				{
					name,
					code
				},
				{
					setupName
				}
			);

			await mkdir(folderPath, { recursive: true });

			await writeTextFile(descriptionFilePath, description);

			if (!isSvgValid(svg)) {
				throw new Error(`Invalid SVG code for ${name} (${code})`);
			}

			let optimizedSvg = svg;

			try {
				({ data: optimizedSvg } = optimizeSvg(svg, svgoConfig));
			}
			catch (error) {
				if (error.name === "SvgoParserError") {
					setupLogger(error);
					setupLogger(error.message);
				}
			}

			const simplifiedSvg = simplifySvg(optimizedSvg);

			await writeTextFile(svgFlagFilePath, simplifiedSvg);

			await svgToPng(svgFlagFilePath, pngFlagFilePath);
		}
		catch (error) {
			setupLogger(`Failed to process ${name} (${code})`);
			setupLogger(error);
		}
	}
};

export default loopOverCountries;
