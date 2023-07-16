import condenseResults from "@/utilities/server/condense-results.js";
import createMatchQuery from "@/utilities/server/create-match-query.js";
import deepSort from "@/utilities/server/deep-sort.js";
import supabase from "@/utilities/shared/supabase.js";

/**
 *
 * @param query
 */
const getDbFlags = async (query = {}) => {
	const matchQuery = createMatchQuery(query, "flag");

	const {
		data: flags,
		error
	} = await supabase
		.from("flags")
		.select(`
			instance:instances!inner(
				name,
				variant:variants!inner(
					name,
					vexillographer:vexillographers!inner(
						name,
						vexillologist:vexillologists!inner(name)
					)
				)
			),
			name,
			score,
			code,
			description,
			comments
		`)
		.match(matchQuery);

	if (error) {
		throw error;
	}

	return deepSort(
		condenseResults({
			results: flags,
			query,
			foreignRootKey: "instance"
		}),
		"name"
	);
};

export default getDbFlags;
