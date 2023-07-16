import { toHtml } from "hast-util-to-html";
import { s } from "hastscript";
import { chunk, uniqBy } from "lodash-es";
import { optimize as optimizeSvg } from "svgo";

import { star } from "./svgd-transpiler/templates.js";

import roundToDecimalPlaces from "@/utilities/shared/round-to-decimal-places.js";

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

/**
 *
 * @param svgd
 */
const svgdTranspiler = (svgd) => {
	const svgdLines = svgd
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	const [firstLine, ...shapeLines] = svgdLines;

	const [svgWidth, svgHeight] = firstLine.split(", ").map((value) => Number(value));

	const usedSymbols = [];

	// eslint-disable-next-line max-lines-per-function, max-statements
	const shapes = shapeLines.map((line) => {
		const [type, valuesString] = line.split(": ");

		const valueStrings = valuesString.split(", ");

		switch (type) {
			case "rect": {
				const [
					id,
					x,
					y,
					width,
					height,
					fill,
					strokeWidth,
					stroke
				] = valueStrings;

				return {
					id,
					type,
					x: Number(x),
					y: Number(y),
					width: Number(width),
					height: Number(height),
					fill,
					strokeWidth: Number(strokeWidth),
					stroke
				};
			}

			case "circle": {
				const [
					id,
					cx,
					cy,
					r,
					fill,
					strokeWidth,
					stroke
				] = valueStrings;

				return {
					id,
					type,
					cx: Number(cx),
					cy: Number(cy),
					r: Number(r),
					fill,
					strokeWidth: Number(strokeWidth),
					stroke
				};
			}

			case "path": {
				const id = valueStrings[0];

				const indexOfFill = valueStrings.length - 3;

				const d = valueStrings
					.slice(1, indexOfFill)
					.join(", ");

				const otherStrings = valueStrings.slice(indexOfFill);

				const [
					fill,
					strokeWidth,
					stroke
				] = otherStrings;

				return {
					id,
					type,
					d,
					fill,
					strokeWidth: Number(strokeWidth),
					stroke
				};
			}

			case "polygon": {
				const id = valueStrings[0];

				const indexOfFill = valueStrings.length - 3;
				const points = chunk(
					valueStrings
						.slice(1, indexOfFill)
						.map(Number),
					2
				);

				const otherStrings = valueStrings.slice(indexOfFill);

				const [
					fill,
					strokeWidth,
					stroke
				] = otherStrings;

				return {
					id,
					type,
					points,
					fill,
					strokeWidth: Number(strokeWidth),
					stroke
				};
			}

			case "star": {
				const [
					id,
					x,
					y,
					width,
					height,
					points,
					fill,
					strokeWidth,
					stroke
				] = valueStrings;

				const symbol = star(Number(points));

				usedSymbols.push({
					symbol,
					key: `star${Number(points)}`
				});

				const {
					properties: {
						id: symbolId,
						width: symbolWidth,
						height: symbolHeight
					}
				} = symbol;

				const useWidth = width === "_"
					? roundToDecimalPlaces(Number(symbolWidth) / (Number(symbolHeight) / Number(height)), 3)
					: Number(width);

				const useHeight = height === "_"
					? roundToDecimalPlaces(Number(symbolHeight) / (Number(symbolWidth) / Number(width)), 3)
					: Number(height);

				return {
					fill,
					height: useHeight,
					href: `#${symbolId}`,
					id,
					stroke,
					strokeWidth: Number(strokeWidth),
					type: "use",
					width: useWidth,
					x: Number(x),
					y: Number(y)
				};
			}

			default:
				throw new Error(`Unknown type: ${type}`);
		}
	});

	let rootChildren = shapes.map(({
		type,
		children = [],
		...attributes
	}) => s(
		type,
		attributes,
		children
	));

	if (usedSymbols.length > 0) {
		rootChildren = [s("defs", {}, ...uniqBy(usedSymbols, "key").map(({ symbol }) => symbol)), ...rootChildren];
	}

	const tree = s(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: `0 0 ${svgWidth} ${svgHeight}`
		},
		rootChildren
	);

	const svgString = toHtml(tree);

	const { data: sanitizedSvgString } = optimizeSvg(
		svgString,
		svgoConfig
	);

	return sanitizedSvgString;
};

export default svgdTranspiler;
