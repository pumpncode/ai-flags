import { TbArrowBigDownLine } from "react-icons/tb";
import { join } from "std/path";

import VexillologistsList from "../components/features/vexillologists-list.jsx";
import RandomFlag from "../islands/random-flag.jsx";

import { getVexillologists } from "@ai-flags/utilities";

const rootFolderPath = join("./");

const setupsFolderPath = join(rootFolderPath, "setups");

const staticFolderPath = join(rootFolderPath, "static");

const staticSetupsFolderPath = join(staticFolderPath, "setups");

const handler = {
	GET: async (request, context) => {
		const vexillologists = await getVexillologists({
			setupsFolderPath,
			staticSetupsFolderPath
		});

		return context.render({
			vexillologists
		});
	}
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.content
 * @param props.data.vexillologists
 */
const Home = ({ data: { vexillologists } }) => (
	<>
		<section className="p-4 md:px-16 md:py-8 flex flex-col gap-8 items-center justify-around bg-neutral-700 h-auto md:h-[calc(100vh-6rem)] min-h-[600px]">
			<h2 className="text-2xl font-bold sm:text-4xl md:text-6xl">Flags (according to AI)</h2>
			<div className="flex flex-col items-center w-full gap-8 md:flex-row">
				<div className="w-full md:w-6/12">
					<RandomFlag {...{ vexillologists }} />
				</div>
				<div className="flex flex-col w-full gap-8 md:w-6/12">
					<span className="flex flex-col items-center gap-1 text-lg font-medium text-center text-amber-300 md:items-start md:text-left">
						<span>What would happen if we ask an AI to describe a flag?</span>
						<span>What if we ask it to generate an image of a flag?</span>
						<span>Find out here!</span>
					</span>
					<span className="flex flex-col gap-1 text-lg border rounded bg-neutral-700 border-amber-300">
						<span className="p-4 border-b border-amber-300">Click on the "Instance" boxes below to see the results of a specific setup!</span>
						<span className="p-4 border-b border-amber-300">Click on a specific flag to view a bigger version and read the description of it!</span>
						<span className="p-4">You can always get the SVG version of a flag by simply replacing the file extension of the URL!</span>
					</span>
				</div>
			</div>
			<div className="shrink-0 text-amber-300 animate-bounce">
				<TbArrowBigDownLine size={48} stroke={1} />
			</div>
		</section>
		<section className="flex flex-col items-start gap-8 p-4 md:p-16">
			<ul className="flex flex-col gap-1">
				<li className="flex gap-2">
					<span>🤓</span>
					<span> - The Vexillologist - The role which describes a flag</span>
				</li>
				<li className="flex gap-2">
					<span>🧑‍🎨</span>
					<span> - The Vexillographer - The role which constructs a flag</span>
				</li>
			</ul>
			<VexillologistsList {...{ vexillologists }} />
		</section>
	</>
);

export { handler };

export default Home;
