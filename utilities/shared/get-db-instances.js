import condenseResults from "@/utilities/server/condense-results.js";
import createMatchQuery from "@/utilities/server/create-match-query.js";
import deepSort from "@/utilities/server/deep-sort.js";
import supabase from "@/utilities/shared/supabase.js";
import { convertMdToHtml } from "@/utilities/server.js";

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

	const refinedInstances = await Promise.all(
		instances
			.map(async ({ flags, ...instance }) => ({
				...instance,
				flags: await Promise.all(
					flags
						.map(async ({
							description: flagDescription,
							comments: flagComments,
							...flag
						}) => ({
							...flag,
							description: flagDescription,
							descriptionHtml: await convertMdToHtml(
								flagDescription
							),
							comments: flagComments,
							commentsHtml: await convertMdToHtml(
								flagComments
							)
						}))
				)
			}))
	);

	return deepSort(
		condenseResults({
			results: refinedInstances,
			query,
			foreignRootKey: "variant"
		}),
		"name"
	);
};

export default getDbInstances;
