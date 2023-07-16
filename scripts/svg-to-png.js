import { Command } from "cliffy";
import { resolve } from "std/path";

import svgToPng from "@/utilities/svg-to-png.js";
import browser from "@/utilities/browser.js";

const {
	args
} = Deno;

const {
	options: {
		input, output, width, height
	}
} = await new Command()
	.name("svg-to-png")
	.version("0.1.0")
	.description("Convert an SVG to a PNG")
	.option(
		"-i, --input <input:string>",
		"file path of input SVG image",
		{ required: true }
	)
	.option(
		"-o, --output <output:string>",
		"file path of output PNG image",
		{ required: true }
	)
	.option(
		"--width <width:number>",
		"width of output PNG image"
	)
	.option(
		"--height <height:number>",
		"height of output PNG image"
	)
	.parse(args);

await svgToPng(
	resolve(input),
	resolve(output),
	width || height
		? {
			resizeWidth: width || null,
			resizeHeight: height || null
		}
		: undefined
);

await browser.close();
