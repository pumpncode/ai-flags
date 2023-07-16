import { DOMParser } from "xmldom";

const isSvgValid = (svg) => {
	let parseErrors = false;

	const parser = new DOMParser({
		errorHandler: {
			warning: (message) => {
				parseErrors = true;
			}
		}
	});

	parser.parseFromString(svg, "image/svg+xml");

	const hasTemplateSyntax = svg.includes("${");

	return !parseErrors && !hasTemplateSyntax;
};

export default isSvgValid;