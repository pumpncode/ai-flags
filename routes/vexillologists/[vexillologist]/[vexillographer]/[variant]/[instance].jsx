import { join } from "std/path";

import InstanceContent from "@ai-flags/components/features/instance-content.jsx";
import { getInstanceContent } from "@ai-flags/utilities";

const rootFolderPath = join("./");

const setupsFolderPath = join(rootFolderPath, "setups");

const staticFolderPath = join(rootFolderPath, "static");

const staticSetupsFolderPath = join(staticFolderPath, "setups");

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				vexillologist,
				vexillographer,
				variant,
				instance
			}
		} = context;

		const vexillologistName = vexillologist;

		const vexillographerName = vexillographer;

		const variantName = variant;

		const instanceName = instance;

		const staticVariantFolderPath = join(
			staticSetupsFolderPath,
			vexillologistName,
			vexillographerName,
			variantName
		);

		const instanceContent = await getInstanceContent({
			staticVariantFolderPath,
			instanceName
		});

		return context.render({
			vexillologistName,
			vexillographerName,
			variantName,
			instanceName,
			instanceContent
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
 * @param props.data.instanceName
 * @param props.data.instanceContent
 */
const Home = ({
	data: {
		vexillologistName,
		vexillographerName,
		variantName,
		instanceName,
		instanceContent
	}
}) => {
	const fullName = `${vexillologistName}/${vexillographerName}/${variantName}/${instanceName}`;

	return (
		<section className="flex flex-col items-start p-4 md:p-16 gap-8">
			<h2>Instance: {fullName}</h2>
			<InstanceContent
				{...{
					flags: instanceContent,
					fullName
				}}
			/>
		</section>
	);
};

export { handler };

export default Home;
