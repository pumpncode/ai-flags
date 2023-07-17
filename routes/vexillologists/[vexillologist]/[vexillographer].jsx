import VariantsList from "@/components/features/variants-list.jsx";
import { getDbVariants } from "@/utilities/server.js";

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				vexillologist,
				vexillographer
			}
		} = context;

		const vexillologistName = vexillologist;

		const vexillographerName = vexillographer;

		const variants = await getDbVariants({
			vexillologistName,
			vexillographerName
		});

		return context.render({
			vexillologistName,
			vexillographerName,
			variants
		});
	}
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.vexillologistName
 * @param props.data.vexillographerName
 * @param props.data.variants
 */
const Home = ({
	data: {
		vexillologistName,
		vexillographerName,
		variants
	}
}) => (
	<section className="flex flex-col items-start gap-8 p-4 md:p-16">
		<h2>Vexillographer: {vexillologistName}/{vexillographerName}</h2>
		<VariantsList
			{...{
				vexillologistName,
				vexillographerName,
				variants
			}}
		/>
	</section>
);

export { handler };

export default Home;
