import { asset } from "$fresh/runtime.ts";

const tools = [
	{
		name: "zigzagger",
		description: "makes SVG shapes and paths zigzaggy or wavy"
	},
	{
		name: "svgd-transpiler",
		description: "transpiles svgd into SVG markup"
	},
	{
		name: "threevex",
		description: "makes 3D flags"
	}
];

/**
 *
 */
const Tools = () => (
	<section className="p-4 md:p-16">
		<h2 className="flex items-center h-24 gap-2">Tools</h2>

		<section className="flex gap-4">
			<ul className="grid gap-4 grid-cols-cards">
				{
					tools.map(({ name, description }, index) => (
						<li className="w-full" key={index}>
							<a href={`./tools/${name}`}>
								<figure className="flex flex-col items-center justify-between w-full h-full gap-2 p-2 border rounded border-neutral-600 hover:bg-neutral-700">
									<div className="flex flex-col items-center justify-center w-full p-2 rounded h-5/6 bg-neutral-700">
										<img
											src={asset(`./images/logos/tools/${name}.png`)}
											alt={`${name} logo`}
											className="h-5/6"
										/>
										<span className="text-lg font-bold h-1/6">{name}</span>
									</div>

									<figcaption className="flex items-center justify-center gap-2 h-1/6">
										<span className="text-sm">{description}</span>
									</figcaption>
								</figure>
							</a>
						</li>
					))
				}
			</ul>
		</section>

	</section>
);

export default Tools;
