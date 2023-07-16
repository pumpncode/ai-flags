import { TbLink, TbRosetteFilled } from "react-icons/tb";

import Button from "../input/button.jsx";

import InstancesList from "./instances-list.jsx";

/**
 *
 * @param props
 * @param props.vexillologistName
 * @param props.vexillographerName
 * @param props.variants
 */
const VariantsList = ({
	vexillologistName,
	vexillographerName,
	variants
}) => (
	<ul className="w-full bg-white bg-opacity-5">
		{
			variants
				.map(({
					name: variantName,
					description,
					descriptionHtml,
					score,
					instances
				}) => (
					<li key={variantName} className="flex flex-col gap-4 p-2 border border-b-0 border-neutral-600 last:border-b sm:p-4 first:rounded-t last:rounded-b">
						<div className="flex items-center justify-between">
							<h5 className="flex items-center gap-2 text-base sm:text-lg">
								<span>Variant {variantName}</span>
								<span className="relative flex items-center justify-center font-mono">
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
							</h5>
							<a href={`/vexillologists/${vexillologistName}/${vexillographerName}/${variantName}`}>
								<Button variant="transparent" size="xl"><TbLink size={24} /></Button>
							</a>
						</div>
						<section className="markdown" dangerouslySetInnerHTML={{ __html: String(descriptionHtml) }} />
						<InstancesList
							{...{
								vexillologistName,
								vexillographerName,
								variantName,
								instances
							}}
						/>
					</li>
				))
		}
	</ul>
);

export default VariantsList;
