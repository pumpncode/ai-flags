import { join } from "std/path";
import { optimize as optimizeSvg } from "svgo";

import addMissingViewBox from "./loop-over-countries/add-missing-view-box.js";
import removeXlink from "./loop-over-countries/remove-xlink.js";

import {
	isSvgValid,
	simplifySvg
} from "@/utilities/local.js";
import svgToPng from "@/utilities/svg-to-png.js";

const countries = await (await fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")).json();

const svgoConfig = {
	multipass: true,
	js2svg: {
		pretty: true,
		indent: "\t"
	},
	plugins: [
		{
			name: "preset-default",
			params: {
				overrides: {
					removeViewBox: false,
					convertShapeToPath: false,
					convertColors: {
						names2hex: false
					}
				}
			}
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

	const promises = [];

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

				// if (await isCompletelyTransparent(pngFlagFilePath)) {
				// 	throw new Error(completelyTransparentErrorMessage);
				// }

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

			const svgWithViewBox = addMissingViewBox(svg);
			const svgWithoutXlink = removeXlink(svgWithViewBox);

			let optimizedSvg = svgWithoutXlink;

			try {
				({ data: optimizedSvg } = optimizeSvg(svgWithoutXlink, svgoConfig));
			}
			catch (error) {
				if (error.name === "SvgoParserError") {
					setupLogger(error);
					setupLogger(error.message);
				}
			}

			const simplifiedSvg = simplifySvg(optimizedSvg);

			await writeTextFile(svgFlagFilePath, simplifiedSvg);

			promises.push(svgToPng(svgFlagFilePath, pngFlagFilePath));
		}
		catch (error) {
			setupLogger(`Failed to process ${name} (${code})`);
			setupLogger(error);
		}
	}

	await Promise.all(promises);
};

export default loopOverCountries;
