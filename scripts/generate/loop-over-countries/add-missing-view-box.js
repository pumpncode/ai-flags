import { traverseSvg } from "@/utilities/local.js";

/**
 *
 * @param svg
 */
const addMissingViewBox = (svg) => traverseSvg(svg, (element) => {
	const { tagName } = element;

	if (
		tagName !== "svg" ||
		element.hasAttribute("viewBox") ||
		!element.hasAttribute("width") ||
		!element.hasAttribute("height")
	) {
		return element;
	}

	const width = element.getAttribute("width");
	const height = element.getAttribute("height");

	element.setAttribute("viewBox", `0 0 ${width} ${height}`);
	element.removeAttribute("width");
	element.removeAttribute("height");

	return element;
});

export default addMissingViewBox;
