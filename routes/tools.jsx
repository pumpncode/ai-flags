import { join, relative } from "std/path";
import { asset } from "$fresh/runtime.ts";
import { cx, css } from "twind";

const tools = [
	{
		name: "zigzagger",
		description: "a tool to make SVG shapes and paths zigzaggy or wavy",

	}
];

const Tools = () => {
	return (
		<section className="p-16">
			<h2 className="flex gap-2 items-center h-24">Tools</h2>

			<section className="flex gap-4">
				<ul className="grid grid-cols-5 gap-4">
					{
						tools.map(({ name, description }, index) => (
							<li className="w-full" key={index}>
								<a href={`./tools/${name}`}>
									<figure className="flex flex-col gap-2 w-full h-full justify-between items-center p-2 border border-neutral-600 rounded hover:bg-neutral-700">
										<div className="w-full flex flex-col items-center justify-center h-5/6 p-2 bg-neutral-700 rounded">
											<img
												src={asset(`./images/logos/tools/${name}.png`)}
												alt={`${name} logo`}
												className="h-5/6"
											/>
											<span className="text-lg font-bold h-1/6">{name}</span>
										</div>

										<figcaption className="h-1/6 flex gap-2 items-center justify-center">
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
	)
};

export default Tools;