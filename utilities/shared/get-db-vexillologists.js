import deepSort from "@/utilities/server/deep-sort.js";
import convertMdToHtml from "@/utilities/server/convert-md-to-html.js";
import supabase from "@/utilities/shared/supabase.js";
import createMatchQuery from "@/utilities/server/create-match-query.js";

/**
 *
 * @param query
 */
const getDbVexillologists = async (query = {}) => {
	const matchQuery = createMatchQuery(query, "vexillologist");

	const {
		data: vexillologists,
		error
	} = await supabase
		.from("vexillologists")
		.select(`
			name,
			score,
			vexillographers (
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
			)
		`)
		.match(matchQuery);

	if (error) {
		throw error;
	}

	const refinedVexillologists = await Promise.all(
		vexillologists
			.map(async ({ vexillographers, ...vexillologist }) => ({
				...vexillologist,
				vexillographers: await Promise.all(
					vexillographers
						.map(async ({ variants, ...vexillographer }) => ({
							...vexillographer,
							variants: await Promise.all(
								variants
									.map(async ({
										description,
										instances,
										...variant
									}) => ({
										...variant,
										description,
										descriptionHtml: await convertMdToHtml(description),
										instances: await Promise.all(
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
										)
									}))
							)
						}))
				)
			}))
	);

	return deepSort(
		refinedVexillologists,
		"name"
	);
};

export default getDbVexillologists;
