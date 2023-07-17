const svgTags = [
	"circle",
	"clipPath",
	"defs",
	"ellipse",
	"g",
	"line",
	"marker",
	"mask",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"rect",
	"style",
	"text",
	"textPath",
	"tspan",
	"use"
];

const svgAttributes = [
	"alignment-baseline",
	"clipPathUnits",
	"clip-path",
	"clip-rule",
	"color",
	"cx",
	"cy",
	"d",
	"direction",
	"dominant-baseline",
	"dx",
	"dy",
	"fill",
	"fill-opacity",
	"fill-rule",
	"font-family",
	"font-size",
	"font-size-adjust",
	"font-stretch",
	"font-style",
	"font-variant",
	"font-weight",
	"height",
	"href",
	"id",
	"lengthAdjust",
	"letter-spacing",
	"marker-end",
	"marker-mid",
	"marker-start",
	"markerHeight",
	"markerUnits",
	"markerWidth",
	"mask",
	"maskContentUnits",
	"maskUnits",
	"method",
	"opacity",
	"orient",
	"overflow",
	"overline-position",
	"overline-thickness",
	"path",
	"pathLength",
	"patternContentUnits",
	"patternTransform",
	"patternUnits",
	"points",
	"preserveAspectRatio",
	"r",
	"refX",
	"refY",
	"rx",
	"ry",
	"spacing",
	"startOffset",
	"strikethrough-position",
	"strikethrough-thickness",
	"stroke",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-opacity",
	"stroke-width",
	"text-anchor",
	"text-decoration",
	"textLength",
	"transform",
	"transform-origin",
	"underline-position",
	"underline-thickness",
	"vector-effect",
	"viewBox",
	"width",
	"word-spacing",
	"writing-mode",
	"x",
	"x1",
	"x2",
	"y",
	"y1",
	"y2"
];

const inputLength = 3;
const inputAlphabetLength = 26;
const alphabetStartAsciiCode = 97;
const inputAlphabet = Array(inputAlphabetLength)
	.fill()
	.map((empty, index) => String.fromCharCode(alphabetStartAsciiCode + index));

const outputMaxLength = 1000;
const outputAlphabet = [
	..." \"#-./0123456789:<=>",
	...svgTags
		.map((tag) => [
			`<${tag}`,
			...svgAttributes
				.map((attribute) => `<${tag} ${attribute}="`),
			`</${tag}>`
		])
		.flat(),
	...svgAttributes
		.map((attribute) => ` ${attribute}="`)
];

const mutationRange = Math.floor(outputAlphabet.length / 3);
const mutationProbability = 0.4;

const resizeHeight = 100;

export {
	inputLength,
	inputAlphabet,
	outputMaxLength,
	outputAlphabet,
	mutationRange,
	mutationProbability,
	resizeHeight
};
