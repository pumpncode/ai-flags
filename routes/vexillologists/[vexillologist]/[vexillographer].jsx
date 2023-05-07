import { join } from "std/path";

import VariantsList from "@ai-flags/components/features/variants-list.jsx";
import { getVariants } from "@ai-flags/utilities";

const rootFolderPath = join("./");

const setupsFolderPath = join(rootFolderPath, "setups");

const staticFolderPath = join(rootFolderPath, "static");

const staticSetupsFolderPath = join(staticFolderPath, "setups");

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				vexillologist,
				vexillographer
			}
		} = context;

		const vexillologistName = vexillologist;

		const vexillographerName = vexillographer;

		const vexillographerFolderPath = join(setupsFolderPath, vexillologistName, vexillographerName);

		const variants = await getVariants({
			vexillographerFolderPath,
			vexillologistName,
			vexillographerName,
			staticSetupsFolderPath
		});

		return context.render({
			vexillologistName,
			vexillographerName,
			variants
		});
	}
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.vexillologistName
 * @param props.data.vexillographerName
 * @param props.data.variants
 */
const Home = ({
	data: {
		vexillologistName,
		vexillographerName,
		variants
	}
}) => (
	<section className="flex flex-col items-start p-4 gap-8 md:p-16">
		<h2>Vexillographer: {vexillologistName}/{vexillographerName}</h2>
		<VariantsList
			{...{
				vexillologistName,
				vexillographerName,
				variants
			}}
		/>
	</section>
);

export { handler };

export default Home;
