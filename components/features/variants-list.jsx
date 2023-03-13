import InstancesList from "./instances-list.jsx";

/**
 *
 * @param props
 * @param props.variants
 */
const VariantsList = ({ variants }) => (
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
					<li key={variantName} className="border border-neutral-600 border-b-0 last-child:border-b  p-2 sm:p-4 flex flex-col gap-4 first-child:rounded-t last-child:rounded-b">
						<h5 className="text-base sm:text-lg">Variant {variantName}</h5>
						<section className="markdown" dangerouslySetInnerHTML={{ __html: String(description) }}/>
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
