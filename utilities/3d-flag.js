import Zdog from "npm:zdog";
import { DOMParser, XMLSerializer } from "npm:xmldom"

// const illustration = new Zdog.Illustration();

const parser = new DOMParser();

const document = parser.parseFromString(`<svg></svg>`, "text/xml");

globalThis.document = document;

const svgElement = document.firstChild;

const zoom = 2;
const sceneWidth = 6000;
const sceneHeight = 3000;
const viewWidth = sceneWidth * zoom;
const viewHeight = sceneHeight * zoom;
const svgWidth = svgElement.getAttribute("width");
const svgHeight = svgElement.getAttribute("height");

svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
svgElement.setAttribute("viewBox", `${-viewWidth / 2}  ${-viewHeight / 2} ${viewWidth} ${viewHeight}`);

const flagGroup = new Zdog.Anchor({
	rotate: {
		x: -(Zdog.TAU / 16),
		y: (Zdog.TAU / 8)
	},
	scale: 1
});

new Zdog.Box({
	addTo: flagGroup,
	width: 6000,
	height: 750,
	depth: 3000,
	stroke: false,
	color: "blue",
	translate: { y: -1125 }
});

new Zdog.Box({
	addTo: flagGroup,
	width: 6000,
	height: 1500,
	depth: 3000,
	stroke: false,
	color: "yellow",
});

new Zdog.Box({
	addTo: flagGroup,
	width: 6000,
	height: 750,
	depth: 3000,
	stroke: false,
	color: "blue",
	translate: { y: 1125 }
});

// render to svg

flagGroup.updateGraph();

flagGroup.renderGraphSvg(svgElement);

svgElement.firstChild.removeAttribute("xmlns");

const serializer = new XMLSerializer();

console.log(serializer.serializeToString(svgElement));