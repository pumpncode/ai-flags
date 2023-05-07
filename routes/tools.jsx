import { asset } from "$fresh/runtime.ts";

const tools = [
	{
		name: "zigzagger",
		description: "a tool to make SVG shapes and paths zigzaggy or wavy"

	}
];

/**
 *
 */
const Tools = () => (
	<section className="p-4 md:p-16">
		<h2 className="flex items-center h-24 gap-2">Tools</h2>

		<section className="flex gap-4">
			<ul className="grid grid-cols-cards gap-4">
				{
					tools.map(({ name, description }, index) => (
						<li className="w-full" key={index}>
							<a href={`./tools/${name}`}>
								<figure className="flex flex-col items-center justify-between w-full h-full p-2 border rounded gap-2 border-neutral-600 hover:bg-neutral-700">
									<div className="flex flex-col items-center justify-center w-full p-2 rounded h-5/6 bg-neutral-700">
										<img
											src={asset(`./images/logos/tools/${name}.png`)}
											alt={`${name} logo`}
											className="h-5/6"
										/>
										<span className="text-lg font-bold h-1/6">{name}</span>
									</div>

									<figcaption className="flex items-center justify-center h-1/6 gap-2">
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
