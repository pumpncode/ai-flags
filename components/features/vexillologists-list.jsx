import { IconLink } from "@tabler/icons-preact";

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
			Object.entries(vexillologists)
				.sort(([vexillologistNameA], [vexillologistNameB]) => (new Intl.Collator()).compare(vexillologistNameA, vexillologistNameB))
				.map(([vexillologistName, vexillographers]) => (
					<li key={vexillologistName} className="flex flex-col p-1 border border-b-0 border-neutral-600 last:border-b sm:p-4 gap-4 first:rounded-t last:rounded-b">
						<div className="flex items-center justify-between">
							<h3 className="font-mono text-xl sm:text-2xl">{vexillologistName} 🤓</h3>
							<a href={`/vexillologists/${vexillologistName}`}>
								<Button variant="transparent" size="xl"><IconLink /></Button>
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
