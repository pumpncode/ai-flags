import { join } from "std/path";

import VexillographersList from "@/components/features/vexillographers-list.jsx";
import { getDbVexillographers } from "@/utilities/server.js";

const {
	readTextFile
} = Deno;

const rootFolderPath = join("./");

const setupsFolderPath = join(rootFolderPath, "setups");

const staticFolderPath = join(rootFolderPath, "static");

const staticSetupsFolderPath = join(staticFolderPath, "setups");

const staticDiffsFolderPath = join(staticFolderPath, "diffs");

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
	const vexillologistDiffsFolderPath = join(staticDiffsFolderPath, vexillologistName);

	const detailsFilePath = join(vexillologistDiffsFolderPath, "details.json");
	const details = JSON.parse(await readTextFile(detailsFilePath));

	const vexillographers = await getDbVexillographers({
		vexillologistName
	});

	return context.render({
		vexillologistName,
		vexillographers,
		details
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
