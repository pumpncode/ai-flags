import { IconLink } from "@tabler/icons-preact";

import Button from "../input/button.jsx";

import InstancesList from "./instances-list.jsx";

/**
 *
 * @param props
 * @param props.variants
 * @param props.vexillologistName
 * @param props.vexillographerName
 */
const VariantsList = ({
	vexillologistName, vexillographerName, variants
}) => (
	<ul>
		{
			Object.entries(variants)
				.sort(([variantNameA], [variantNameB]) => (new Intl.Collator()).compare(variantNameA, variantNameB))
				.map(([
					variantName,
					{
						description,
						instances,
						fullName
					}
				]) => (
					<li key={variantName} className="flex flex-col p-2 border border-b-0 gap-4 border-neutral-600 last:border-b sm:p-4 first:rounded-t last:rounded-b">
						<div className="flex items-center justify-between">
							<h5 className="text-base sm:text-lg">Variant {variantName}</h5>
							<a href={`/vexillologists/${vexillologistName}/${vexillographerName}/${variantName}`}>
								<Button variant="transparent" size="xl"><IconLink /></Button>
							</a>
						</div>
						<section className="markdown" dangerouslySetInnerHTML={{ __html: String(description) }} />
						<InstancesList
							{...{
								instances,
								fullVariantName: fullName
							}}
						/>
					</li>
				))
		}
	</ul>
);

export default VariantsList;
