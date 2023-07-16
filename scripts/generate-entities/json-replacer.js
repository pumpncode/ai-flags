/**
 *
 */
const JsonReplacer = class {

	// deno-lint-ignore no-unused-vars
	/**
	 *
	 * @param key
	 * @param value
	 */
	static lossy = (key, value) => {
		switch (Object.prototype.toString.call(value).replace(/^\[object (.*?)]$/, "$1")) {
			case "Map":
				return Object.fromEntries(value);
			case "Set":
				return [...value];
			default:
				return value;
		}
	};

	// deno-lint-ignore no-unused-vars
	/**
	 *
	 * @param key
	 * @param value
	 */
	static lossless = (key, value) => {
		switch (Object.prototype.toString.call(value).replace(/^\[object (.*?)]$/, "$1")) {
			case "Map":
				return {
					dataType: "Map",
					value: [...value]
				};
			case "Set":
				return {
					dataType: "Set",
					value: [...value]
				};
			default:
				return value;
		}
	};

};

const { lossy } = JsonReplacer;
const { lossless } = JsonReplacer;

export {
	lossy,
	lossless
};

export default JsonReplacer;
