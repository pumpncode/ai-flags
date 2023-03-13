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
					<li key={vexillologistName} className="border border-neutral-600 border-b-0 last-child:border-b p-1 sm:p-4 flex flex-col gap-4 first-child:rounded-t last-child:rounded-b">
						<h3 className="text-xl sm:text-2xl font-mono">{vexillologistName} 🤓</h3>

						<VexillographersList {...{ vexillographers }} />
					</li>
				))
		}
	</ul>
);

export default VexillologistsList;
