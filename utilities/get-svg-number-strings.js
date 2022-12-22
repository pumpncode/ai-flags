import { format } from "npm:mathjs";
import SvgPath from "npm:svgpath";

import { traverseSvg } from "@ai-flags/utilities";

const getSvgNumberStrings = (svg) => {
	const numberStrings = new Set();

	traverseSvg(
		svg,
		(element) => {
			const { attributes } = element;

			for (const { name, value } of Array.from(attributes)) {
				switch (name) {
					case "d": {
						const { segments } = new SvgPath(value);

						for (const [letter, ...numbers] of segments) {
							for (const number of numbers) {
								if (number !== 0) {
									numberStrings.add(format(number, { notation: "fixed" }));
								}
							}
						}
						break;
					}
					default: {
						const numbersInValue = [...value.matchAll(/(?:(?<=(?:^| |\(|,))(?:(?:\d+(?:\.\d+)?)|(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))|(?:(?<=(?:^| |\(|\d|,))-(?:(?:\d+(?:\.\d+)?)|(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))|(?:(?<=(?:^| |\(|\d|,))(?:(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))/g)]
							.map((match) => match[0])
							.filter((match) => match !== "0")

						for (const number of numbersInValue) {
							numberStrings.add(number);
						}
						break;
					}
				}
			}
		}
	);

	return new Set([...numberStrings].sort((a, b) => b.length - a.length));
};

export default getSvgNumberStrings;