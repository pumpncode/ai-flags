import { TbLink, TbRosetteFilled } from "react-icons/tb";

import Button from "../input/button.jsx";

import VexillographersList from "./vexillographers-list.jsx";

/**
 *
 * @param props
 * @param props.vexillologists
 */
const VexillologistsList = ({ vexillologists }) => (
	<ul className="w-full">

		{
			vexillologists
				.map(({
					name: vexillologistName,
					score,
					vexillographers
				}) => (
					<li key={vexillologistName} className="flex flex-col gap-4 p-1 border border-b-0 border-neutral-600 last:border-b sm:p-4 first:rounded-t last:rounded-b">
						<div className="flex items-center justify-between">
							<h3 className="flex items-center gap-2 font-mono text-xl sm:text-2xl">
								<span>{vexillologistName}</span>
								<span>🤓</span>
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
							</h3>
							<a href={`/vexillologists/${vexillologistName}`}>
								<Button variant="transparent" size="xl"><TbLink size={24} /></Button>
							</a>
						</div>

						<VexillographersList
							{...{
								vexillologistName,
								vexillographers
							}}
						/>
					</li>
				))
		}
	</ul>
);

export default VexillologistsList;
