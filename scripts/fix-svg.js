import { optimize as optimizeSvg } from "svgo";

import { isSvgValid, simplifySvg } from "@/utilities/local.js";

const {
	args: [svgFilePath],
	readTextFile,
	writeTextFile
} = Deno;

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

if (!svgFilePath) {
	throw new Error("Missing SVG file path");
}

const svg = await readTextFile(svgFilePath);

if (!isSvgValid(svg)) {
	throw new Error(`Invalid SVG code for ${name} (${code})`);
}

const { data: optimizedSvg } = optimizeSvg(svg, svgoConfig);

const simplifiedSvg = simplifySvg(optimizedSvg);

const fixedSvgFilePath = svgFilePath.replace(/\.svg$/, "-fixed.svg");

await writeTextFile(fixedSvgFilePath, simplifiedSvg);
