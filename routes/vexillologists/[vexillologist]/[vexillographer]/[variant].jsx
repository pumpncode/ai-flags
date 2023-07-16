import { join } from "std/path";

import InstancesList from "@/components/features/instances-list.jsx";
import { getInstances } from "@/utilities/server.js";

const rootFolderPath = join("./");

const setupsFolderPath = join(rootFolderPath, "setups");

const staticFolderPath = join(rootFolderPath, "static");

const staticSetupsFolderPath = join(staticFolderPath, "setups");

const staticDiffsFolderPath = join(staticFolderPath, "diffs");

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				vexillologist,
				vexillographer,
				variant
			}
		} = context;

		const vexillologistName = vexillologist;

		const vexillographerName = vexillographer;

		const variantName = variant;

		const staticVariantFolderPath = join(
			staticSetupsFolderPath,
			vexillologistName,
			vexillographerName,
			variantName
		);

		const variantDiffsFolderPath = join(
			staticDiffsFolderPath,
			vexillologistName,
			vexillographerName,
			variantName
		);

		const instances = await getInstances({
			staticVariantFolderPath,
			variantDiffsFolderPath
		});

		return context.render({
			vexillologistName,
			vexillographerName,
			variantName,
			instances
		});
	}
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.vexillologistName
 * @param props.data.vexillographerName
 * @param props.data.variantName
 * @param props.data.instances
 */
const Home = ({
	data: {
		vexillologistName,
		vexillographerName,
		variantName,
		instances
	}
}) => {
	const fullVariantName = `${vexillologistName}/${vexillographerName}/${variantName}`;

	return (
		<section className="flex flex-col items-start p-4 gap-8 md:p-16">
			<h2>Variant: {vexillologistName}/{vexillographerName}/{variantName}</h2>
			<InstancesList
				{...{
					instances,
					fullVariantName
				}}
			/>
		</section>
	);
};

export { handler };

export default Home;
