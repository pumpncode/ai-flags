import InstanceContent from "@/components/features/instance-content.jsx";
import { getDbFlags } from "@/utilities/server.js";

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				vexillologist,
				vexillographer,
				variant,
				instance
			}
		} = context;

		const vexillologistName = vexillologist;

		const vexillographerName = vexillographer;

		const variantName = variant;

		const instanceName = instance;

		const instanceContent = await getDbFlags({
			vexillologistName,
			vexillographerName,
			variantName,
			instanceName
		});

		return context.render({
			vexillologistName,
			vexillographerName,
			variantName,
			instanceName,
			instanceContent
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
 * @param props.data.instanceName
 * @param props.data.instanceContent
 */
const Home = ({
	data: {
		vexillologistName,
		vexillographerName,
		variantName,
		instanceName,
		instanceContent
	}
}) => {
	const fullName = `${vexillologistName}/${vexillographerName}/${variantName}/${instanceName}`;

	return (
		<section className="flex flex-col items-start gap-8 p-4 md:p-16">
			<h2>Instance: {fullName}</h2>
			<InstanceContent
				{...{
					flags: instanceContent,
					fullName
				}}
			/>
		</section>
	);
};

export { handler };

export default Home;
