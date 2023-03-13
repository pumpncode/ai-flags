import VariantsList from "./variants-list.jsx";

/**
 *
 * @param root0
 * @param root0.vexillographers
 */
const VexillographersList = ({ vexillographers }) => (
	<ul>
		{
			Object.entries(vexillographers)
				.sort(([vexillographerNameA], [vexillographerNameB]) => (new Intl.Collator()).compare(vexillographerNameA, vexillographerNameB))
				.map(([vexillographerName, variants]) => (
					<li key={vexillographerName} className="border border-neutral-600 border-b-0 last-child:border-b p-1 sm:p-4 flex flex-col gap-4 first-child:rounded-t last-child:rounded-b">
						<h4 className="text-lg sm:text-xl font-mono">{vexillographerName} 🧑‍🎨</h4>
						<VariantsList {...{ variants }} />
					</li>
				))
		}
	</ul>
);

export default VexillographersList;
