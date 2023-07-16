import condenseResults from "@/utilities/server/condense-results.js";
import createMatchQuery from "@/utilities/server/create-match-query.js";
import deepSort from "@/utilities/server/deep-sort.js";
import supabase from "@/utilities/shared/supabase.js";
import convertDescription from "@/utilities/server/convert-description.js";

/**
 *
 * @param query
 */
const getDbVexillographers = async (query = {}) => {
	const matchQuery = createMatchQuery(query, "vexillographer");

	const {
		data: vexillographers,
		error
	} = await supabase
		.from("vexillographers")
		.select(`
			vexillologist:vexillologists!inner(name),
			name,
			score,
			variants (
				name,
				score,
				description,
				instances (
					name,
					score,
					flags (
						name,
						score,
						code
					)
				)
			)
		`)
		.match(matchQuery);

	if (error) {
		throw error;
	}

	const refinedVexillographers = await Promise.all(
		vexillographers
			.map(async ({ variants, ...vexillographer }) => ({
				...vexillographer,
				variants: await Promise.all(
					variants
						.map(async ({ description, ...variant }) => ({
							...variant,
							description,
							descriptionHtml: await convertDescription(description)
						}))
				)
			}))
	);

	return deepSort(
		condenseResults({
			results: refinedVexillographers,
			query,
			foreignRootKey: "vexillologist"
		}),
		"name"
	);
};

export default getDbVexillographers;
