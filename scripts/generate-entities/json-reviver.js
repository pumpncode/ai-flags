const JsonReviver = class {
	// deno-lint-ignore no-unused-vars
	static lossy = (key, value) => {
		switch (Object.prototype.toString.call(value).replace(/^\[object (.*?)]$/, "$1")) {
			case "Object":
				switch (value.dataType) {
					case "Map":
						return new Map(value.value);
					case "Set":
						return new Set(value.value);
					default:
						return new Map(Object.entries(value));
				}
			case "Array":
				return new Set(value);
			default:
				return value;
		}
	}

	// deno-lint-ignore no-unused-vars
	static lossless = (key, value) => {
		switch (Object.prototype.toString.call(value).replace(/^\[object (.*?)]$/, "$1")) {
			case "Object":
				switch (value.dataType) {
					case "Map":
						return new Map(value.value);
					case "Set":
						return new Set(value.value);
				}
			// falls through
			default:
				return value;
		}
	}
}

const lossy = JsonReviver.lossy;
const lossless = JsonReviver.lossless;

export {
	lossy,
	lossless
};

export default JsonReviver;