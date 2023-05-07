import { snakeCase } from "npm:lodash-es";

/**
 *
 * @param object
 */
const snakeCaseObject = (object) => Object.fromEntries(
	Object.entries(object)
		.map(([key, value]) => [snakeCase(key), value])
);

export default snakeCaseObject;
