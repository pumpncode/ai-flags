import { format, bignumber } from "npm:mathjs";
import SvgPath from "npm:svgpath";

import { traverseSvg } from "@ai-flags/utilities";

const replaceSvgNumberStrings = (svg, replaceMap) => {
	return traverseSvg(
		svg,
		(element) => {
			const { attributes } = element;

			for (const { name, value } of Array.from(attributes)) {
				switch (name) {
					case "d": {
						const svgPath = new SvgPath(value);
						const { segments } = svgPath;

						const newSegments = [];

						for (const [letter, ...numbers] of segments) {
							newSegments.push([
								letter,
								...numbers.map((number) => replaceMap.get(format(bignumber(number), { notation: "fixed" })) || number)
							]);
						}

						svgPath.segments = newSegments;

						element.setAttribute(name, svgPath.toString());

						break;
					}
					default: {
						const newAttributeValue = value.replace(
							/(?:(?<=(?:^| |\(|,))(?:(?:\d+(?:\.\d+)?)|(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))|(?:(?<=(?:^| |\(|\d|,))-(?:(?:\d+(?:\.\d+)?)|(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))|(?:(?<=(?:^| |\(|\d|,))(?:(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))/g,
							(match) => {
								return replaceMap.get(format(bignumber(match), { notation: "fixed" })) || match;
							}
						);

						element.setAttribute(name, newAttributeValue);

						break;
					}
				}
			}
		}
	);
};

export default replaceSvgNumberStrings;