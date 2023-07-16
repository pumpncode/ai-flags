import { join } from "std/path";

const {
	cwd,
	errors: {
		NotFound
	},
	readTextFile
} = Deno;

const handler = {
	// eslint-disable-next-line max-statements
	GET: async (request, context) => {
		const {
			params: {
				vexillologist,
				vexillographer,
				variant,
				instance,
				code
			}
		} = context;

		const setupName = [
			vexillologist,
			vexillographer,
			variant,
			instance
		].join("/");

		const countries = JSON.parse(await readTextFile(join(cwd(), "static", "countries.json")));

		const pngFlagPath = `/setups/${setupName}/${code}/flag.png`;

		try {
			return context.render({
				name: countries.find(({ cca3 }) => cca3 === code.toLocaleUpperCase()).name.common,
				code,
				pngFlagPath,
				setupName
			});
		}
		catch (error) {
			return new Response("Not found", {
				status: 404
			});
		}
	}
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.name
 * @param props.data.pngFlagPath
 * @param props.data.setupName
 */
const FlagDetails = ({
	data: {
		name,
		pngFlagPath,
		setupName
	}
}) => (
	<figure className="fixed top-0 left-0 z-[1000] flex flex-col items-center justify-between w-screen h-screen gap-1 p-[2.5vw] bg-neutral-800">
		<div className="flex items-center justify-center w-full p-[2.5vw] rounded-[0.5vw] h-5/6 bg-neutral-700">
			<img
				src={pngFlagPath}
				alt={`Flag of ${name} (according to ${setupName})`}
				className="max-w-full max-h-full border border-neutral-800"
				style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 3vw 3vw" }}
			/>
		</div>

		<figcaption className="flex flex-col items-center justify-center gap-[1vw] text-center h-1/6">
			<span className="text-[3.6vw] font-semibold">Flag of {name}</span>
			<span className="text-[2.5vw]">(according to <span className="px-[0.75vw] py-[0.5vw] font-mono text-[2vw] rounded-[0.5vw] bg-neutral-700">{setupName}</span>)</span>
		</figcaption>
	</figure>

);

export { handler };

export default FlagDetails;
