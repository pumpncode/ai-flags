import { DOMParser } from "xmldom-browser";

const traverseSvg = (svg, iteratee) => {
	const traverseSvgElement = (element) => {
		iteratee(element);

		if (element.childNodes) {
			for (const childNode of Array.from(element.childNodes)) {

				if (childNode.nodeType === 1) {
					traverseSvgElement(childNode);
				}
			}
		}
	};

	const parser = new DOMParser();
	const parsedSvg = parser.parseFromString(svg, "image/svg+xml");

	traverseSvgElement(parsedSvg.documentElement);

	return parsedSvg.documentElement.toString();
};

export default traverseSvg;