import staticFileExtensions from "./static-file-extensions.js";

/**
 *
 * @param {...object} parts
 */
const generateUrlPattern = (...parts) => parts
	.map(({ type, name }) => {
		switch (type) {
			case "nonFile": {
				const extensionsPattern = [...staticFileExtensions].map((extension) => `.${extension}`).join("|");

				return `/:${name}([a-z0-9.-]+(?<!${extensionsPattern})$)`;
			}

			default:
				return `/:${name}`;
		}
	})
	.join("");

export default generateUrlPattern;
