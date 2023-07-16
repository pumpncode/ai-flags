import cn from "classnames";

import { asset } from "$fresh/runtime.ts";

/**
 *
 * @param props
 * @param props.flags
 * @param props.fullName
 */
const InstanceContent = ({ flags, fullName }) => (
	<ul className="grid w-full gap-4 grid-cols-cards">
		{
			flags.map((
				{
					name,
					code,
					score
				},
				index
			) => {
				const pngFlagPath = `/setups/${fullName}/${code}/flag.png`;

				return (
					<li className="w-full h-48" key={index}>
						<a href={`/vexillologists/${fullName}/${code}`}>
							<figure
								className={cn(
									"flex flex-col items-center justify-between w-full h-full gap-2 p-2 border rounded bg-neutral-800 hover:bg-neutral-700"
								)}
								style={{
									borderColor: `hsl(46, ${score * 97}%, 65%)`
								}}
							>
								<div className="flex items-center justify-center w-full p-2 rounded h-36 bg-neutral-700">
									<img
										src={asset(pngFlagPath)}
										alt={`Flag of ${name} (according to ${fullName})`}
										loading="lazy"
										className="max-w-full max-h-full border border-neutral-800"
										style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}
									/>
								</div>

								<figcaption className="flex items-center justify-center h-6 gap-2">
									<span className="text-sm">{name}</span>
									<span className="text-xs font-mono bg-neutral-700 px-1 py-0.5 rounded">({code})</span>
								</figcaption>
							</figure>
						</a>
					</li>
				);
			})
		}
	</ul>
);

export default InstanceContent;
