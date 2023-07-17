import VexillographersList from "@/components/features/vexillographers-list.jsx";
import { getDbVexillographers, getDbVexillologists } from "@/utilities/server.js";

/**
 *
 * @param request
 * @param context
 */
const handler = async (request, context) => {
	const {
		params: {
			vexillologist
		}
	} = context;

	const vexillologistName = vexillologist;

	const { score } = await getDbVexillologists({
		vexillologistName
	});

	const vexillographers = await getDbVexillographers({
		vexillologistName
	});

	return context.render({
		vexillologistName,
		vexillographers,
		score
	});
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.vexillologistName
 * @param props.data.vexillographers
 */
const Home = ({ data: { vexillologistName, vexillographers } }) => (
	<section className="flex flex-col items-start gap-8 p-4 md:p-16">
		<h2>Vexillologist: {vexillologistName}</h2>
		<VexillographersList
			{...{
				vexillologistName,
				vexillographers
			}}
		/>
	</section>
);

export { handler };

export default Home;
