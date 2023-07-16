import { flatten, unflatten } from "flatten";
import { camelCase } from "npm:lodash-es";

/**
 *
 * @param options
 * @param options.results
 * @param options.query
 * @param options.foreignRootKey
 */
const condenseResults = ({
	results,
	query,
	foreignRootKey
}) => results.map(({ [foreignRootKey]: foreignRoot, ...result }) => ({
	...result,
	...unflatten(
		Object.fromEntries(
			Object.entries(flatten({ [foreignRootKey]: foreignRoot }))
				.filter(([key, value]) => typeof query[camelCase(key.split(".").slice(-2).join("-"))] === "undefined")
		)
	)
}));

export default condenseResults;
