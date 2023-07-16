import { TbLink, TbRosetteFilled } from "react-icons/tb";

import Button from "../input/button.jsx";

import VariantsList from "./variants-list.jsx";

/**
 *
 * @param props
 * @param props.vexillologistName
 * @param props.vexillographers
 */
const VexillographersList = ({ vexillologistName, vexillographers }) => (
	<ul className="w-full bg-white bg-opacity-5">
		{
			vexillographers
				.map(({
					name: vexillographerName,
					score,
					variants
				}) => (
					<li key={vexillographerName} className="flex flex-col gap-4 p-1 border border-b-0 border-neutral-600 last:border-b sm:p-4 first:rounded-t last:rounded-b">
						<div className="flex items-center justify-between">
							<h4 className="flex items-center gap-2 font-mono text-lg sm:text-xl">
								<span>{vexillographerName}</span>
								<span>🧑‍🎨</span>
								<span className="relative flex items-center justify-center">
									<TbRosetteFilled
										size={48}
										className="text-amber-300"
										style={{
											filter: `drop-shadow(0 0 10px #fcd34d40) saturate(${score}) `
										}}
									/>
									<span className="absolute text-xs font-bold text-neutral-800">
										{score * 1000}
									</span>
								</span>
							</h4>
							<a href={`/vexillologists/${vexillologistName}/${vexillographerName}`}>
								<Button variant="transparent" size="xl"><TbLink size={24} /></Button>
							</a>
						</div>
						<VariantsList
							{...{
								vexillologistName,
								vexillographerName,
								variants
							}}
						/>
					</li>
				))
		}
	</ul>
);

export default VexillographersList;
