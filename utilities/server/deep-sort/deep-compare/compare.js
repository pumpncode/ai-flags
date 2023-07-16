import collator from "./compare/collator.js";

/**
 *
 * @param itemA
 * @param itemB
 * @param options
 * @param options.type
 * @param options.direction
 */
const compare = (itemA, itemB, { type, direction }) => {
	switch (type) {
		case "string":
			switch (direction) {
				case "ascending":
					return collator.compare(itemA, itemB);
				case "descending":
					return collator.compare(itemB, itemA);
				default:
					throw new Error(`Unknown direction: ${direction}`);
			}

		case "number":
			switch (direction) {
				case "ascending":
					return itemA - itemB;
				case "descending":
					return itemB - itemA;
				default:
					throw new Error(`Unknown direction: ${direction}`);
			}

		default:
			throw new Error(`Unknown type: ${type}`);
	}
};

export default compare;
