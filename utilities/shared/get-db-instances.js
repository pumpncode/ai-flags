import condenseResults from "@/utilities/server/condense-results.js";
import createMatchQuery from "@/utilities/server/create-match-query.js";
import deepSort from "@/utilities/server/deep-sort.js";
import supabase from "@/utilities/shared/supabase.js";

/**
 *
 * @param query
 */
const getDbInstances = async (query = {}) => {
	const matchQuery = createMatchQuery(query, "instance");

	const {
		data: instances,
		error
	} = await supabase
		.from("instances")
		.select(`
			variant:variants!inner(
				name,
				vexillographer:vexillographers!inner(
					name,
					vexillologist:vexillologists!inner(name)
				)
			),
			name,
			score,
			flags (
				name,
				score,
				code
			)
		`)
		.match(matchQuery);

	if (error) {
		throw error;
	}

	return deepSort(
		condenseResults({
			results: instances,
			query,
			foreignRootKey: "variant"
		}),
		"name"
	);
};

export default getDbInstances;
