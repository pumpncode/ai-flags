import { IconLink } from "@tabler/icons-preact";

import Button from "../input/button.jsx";

import VariantsList from "./variants-list.jsx";

/**
 *
 * @param props
 * @param props.vexillographers
 * @param props.vexillologistName
 */
const VexillographersList = ({ vexillologistName, vexillographers }) => (
	<ul>
		{
			Object.entries(vexillographers)
				.sort(([vexillographerNameA], [vexillographerNameB]) => (new Intl.Collator()).compare(vexillographerNameA, vexillographerNameB))
				.map(([vexillographerName, variants]) => (
					<li key={vexillographerName} className="flex flex-col p-1 border border-b-0 border-neutral-600 last:border-b sm:p-4 gap-4 first:rounded-t last:rounded-b">
						<div className="flex items-center justify-between">
							<h4 className="font-mono text-lg sm:text-xl">{vexillographerName} 🧑‍🎨</h4>
							<a href={`/vexillologists/${vexillologistName}/${vexillographerName}`}>
								<Button variant="transparent" size="xl"><IconLink /></Button>
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
