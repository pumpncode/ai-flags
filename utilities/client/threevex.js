import { XMLSerializer } from "xmldom";
import Zdog from "zdog";

// const illustration = new Zdog.Illustration();

/**
 *
 * @param options
 * @param options.width
 * @param options.height
 * @param options.depth
 * @param options.stripes
 * @param options.direction
 * @param options.svgElement
 */
// eslint-disable-next-line max-statements
const threevex = ({
	width,
	height,
	depth,
	stripes,
	direction,
	svgElement
}) => {
	const zoom = 3;
	const sceneWidth = width;
	const sceneHeight = depth;
	const viewWidth = sceneWidth * zoom;
	const viewHeight = sceneHeight * zoom;

	svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	svgElement.setAttribute("viewBox", `${-viewWidth / 2}  ${-viewHeight / 2} ${viewWidth} ${viewHeight}`);
	svgElement.setAttribute("width", viewWidth);
	svgElement.setAttribute("height", viewHeight);

	svgElement.innerHTML = "";

	const illo = new Zdog.Illustration({
		element: svgElement,
		dragRotate: true
	});

	const flagGroup = new Zdog.Anchor({
		addTo: illo,
		rotate: {
			x: -(Zdog.TAU / 16),
			y: (Zdog.TAU / 8)
		},
		scale: 1
	});

	const numberOfStripes = stripes.length;

	const colors = [
		"red",
		"white",
		"blue",
		"green"
	];

	for (const [stripeIndexString, { color }] of Object.entries(stripes)) {
		const stripeIndex = Number(stripeIndexString);

		new Zdog.Box({
			addTo: flagGroup,
			width: direction === "horizontal" ? width : width / numberOfStripes,
			height: direction === "horizontal" ? height / numberOfStripes : height,
			depth,
			stroke: false,
			color,
			translate: {
				x: direction === "horizontal" ? 0 : width * (((stripeIndex + (1 / 2)) / numberOfStripes) - (1 / 2)),
				y: direction === "horizontal" ? height * (((stripeIndex + (1 / 2)) / numberOfStripes) - (1 / 2)) : 0
			}
		});
	}

	// render to svg

	flagGroup.updateGraph();

	flagGroup.renderGraphSvg(svgElement);

	svgElement.firstChild.removeAttribute("xmlns");

	const serializer = new XMLSerializer();

	const svgString = serializer.serializeToString(svgElement);

	return svgString;
};

export default threevex;
