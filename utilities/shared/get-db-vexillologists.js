import deepSort from "@/utilities/server/deep-sort.js";
import convertDescription from "@/utilities/server/convert-description.js";
import supabase from "@/utilities/shared/supabase.js";

/**
 *
 */
const getDbVexillologists = async () => {
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
		`);

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
									.map(async ({ description, ...variant }) => ({
										...variant,
										description,
										descriptionHtml: await convertDescription(description)
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
