import InstancesList from "@/components/features/instances-list.jsx";
import { getDbInstances } from "@/utilities/server.js";

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				vexillologist,
				vexillographer,
				variant
			}
		} = context;

		const vexillologistName = vexillologist;

		const vexillographerName = vexillographer;

		const variantName = variant;

		const instances = await getDbInstances({
			vexillologistName,
			vexillographerName,
			variantName
		});

		return context.render({
			vexillologistName,
			vexillographerName,
			variantName,
			instances
		});
	}
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.vexillologistName
 * @param props.data.vexillographerName
 * @param props.data.variantName
 * @param props.data.instances
 */
const Home = ({
	data: {
		vexillologistName,
		vexillographerName,
		variantName,
		instances
	}
}) => {
	const fullVariantName = `${vexillologistName}/${vexillographerName}/${variantName}`;

	return (
		<section className="flex flex-col items-start gap-8 p-4 md:p-16">
			<h2>Variant: {vexillologistName}/{vexillographerName}/{variantName}</h2>
			<InstancesList
				{...{
					instances,
					fullVariantName
				}}
			/>
		</section>
	);
};

export { handler };

export default Home;
