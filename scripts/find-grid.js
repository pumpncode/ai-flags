import {
	fraction,
	gcd,
	lcm
} from "npm:mathjs";
import { Command } from "cliffy";
import { expandGlob } from "std/fs";

import { traverseSvg } from "@/utilities/local.js";

const {
	args,
	readDir,
	readTextFile,
	openKv
} = Deno;

const {
	options,
	options: {
		input,
		output,
		reload
	}
} = await new Command()
	.name("find-grid")
	.version("0.1.0")
	.description("Finds best grid for images")
	.option(
		"-i, --input <input:string>",
		"glob of input svgs (surround with quotes to avoid expanding in shell)",
		{ required: true }
	)
	.option(
		"-o, --output <output:string>",
		"path of output html",
		{ required: true }
	)
	.option(
		"-r --reload [reload:boolean]",
		"reload cache"
	)
	.parse(args);

// script that loops over a folder of svg files, reads their widths and heights and finds the most square looking grid that fits them all

let annotatedSvgs = [];

const kv = await openKv();

const { value: cachedAnnotatedSvgs } = await kv.get(["annotatedSvgs", input]);

if (cachedAnnotatedSvgs !== null && !reload) {
	annotatedSvgs = cachedAnnotatedSvgs;
}
else {
	const svgFilePaths = [];

	for await (const { path, isFile } of expandGlob(input, { globstar: true })) {
		if (isFile) {
			svgFilePaths.push(path);
		}
	}

	annotatedSvgs = await Promise.all(
		svgFilePaths
			.map(async (svgFilePath) => {
				const svg = await readTextFile(svgFilePath);

				let width = 0;
				let height = 0;

				traverseSvg(
					svg,
					(element) => {
						const { tagName } = element;

						if (tagName === "svg" && element.hasAttribute("viewBox")) {
							const viewBox = element.getAttribute("viewBox");

							(
								[width, height] = viewBox.split(" ").slice(2).map(Number)
							);
						}

						return element;
					}
				);

				const {
					n: normaliedWidth,
					d: normaliedHeight
				} = fraction(width, height);

				return {
					path: svgFilePath,
					width: normaliedWidth,
					height: normaliedHeight
				};
			})
	);
}

await kv.set(["annotatedSvgs", input], annotatedSvgs);

const allUniqueHeights = [...(new Set(annotatedSvgs.map(({ height }) => height)))];
const allUniqueWidths = [...(new Set(annotatedSvgs.map(({ width }) => width)))];

const leastCommonMultipleOfHeights = lcm(...allUniqueHeights);
const greatestCommonDivisorOfWidths = gcd(...allUniqueWidths);

const normalizedSvgs = annotatedSvgs
	.map(({
		path,
		width,
		height
	}) => ({
		path,
		width: (width * leastCommonMultipleOfHeights) / (height * greatestCommonDivisorOfWidths),
		height: leastCommonMultipleOfHeights / greatestCommonDivisorOfWidths
	}));

console.log(normalizedSvgs);
console.log([...(new Set(normalizedSvgs.map(({ width }) => width)))].length);
