import { join } from "std/path";

import VexillographersList from "@ai-flags/components/features/vexillographers-list.jsx";
import { getVexillographers } from "@ai-flags/utilities";

const {
	errors: {
		NotFound
	}
} = Deno;

const rootFolderPath = join("./");

const setupsFolderPath = join(rootFolderPath, "setups");

const staticFolderPath = join(rootFolderPath, "static");

const staticSetupsFolderPath = join(staticFolderPath, "setups");

/**
 *
 * @param request
 * @param context
 */
const handler = async (request, context) => {
	const {
		params: {
			vexillologist
		}
	} = context;

	const vexillologistName = vexillologist;

	const vexillologistFolderPath = join(setupsFolderPath, vexillologistName);

	const vexillographers = await getVexillographers({
		vexillologistFolderPath,
		vexillologistName,
		staticSetupsFolderPath
	});

	return context.render({
		vexillologistName,
		vexillographers
	});
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.vexillologistName
 * @param props.data.vexillographers
 */
const Home = ({ data: { vexillologistName, vexillographers } }) => (
	<section className="flex flex-col items-start p-4 md:p-16 gap-8">
		<h2>Vexillologist: {vexillologistName}</h2>
		<VexillographersList
			{...{
				vexillologistName,
				vexillographers
			}}
		/>
	</section>
);

export { handler };

export default Home;
