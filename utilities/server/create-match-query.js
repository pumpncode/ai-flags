import { flatten } from "flatten";

const structure = {
	flag: {
		name: "flagName",
		instance: {
			name: "instanceName",
			variant: {
				name: "variantName",
				vexillographer: {
					name: "vexillographerName",
					vexillologist: {
						name: "vexillologistName"
					}
				}
			}
		}
	}
};

/**
 *
 * @param rawQuery
 * @param root
 */
const createMatchQuery = (rawQuery, root) => Object.fromEntries(
	Object.entries(
		flatten(structure)
	)
		.filter(([key, value]) => typeof rawQuery[value] !== "undefined")
		.map(([key, value]) => (
			[key.replace(new RegExp(`^.*?${root}\\.`, "u"), ""), rawQuery[value]]
		))
);

export default createMatchQuery;
