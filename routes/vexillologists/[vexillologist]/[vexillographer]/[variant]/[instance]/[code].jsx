import { join } from "std/path";

import { getDbFlags } from "@/utilities/server.js";

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

		const vexillologistName = vexillologist;

		const vexillographerName = vexillographer;

		const variantName = variant;

		const instanceName = instance;

		const flagCode = code;

		const [
			{
				name,
				descriptionHtml,
				commentsHtml
			}
		] = await getDbFlags({
			vexillologistName,
			vexillographerName,
			variantName,
			instanceName,
			flagCode
		});

		const setupName = [
			vexillologist,
			vexillographer,
			variant,
			instance
		].join("/");

		const pngFlagFilePath = join("/vexillologists", setupName, code.toLocaleLowerCase(), "flag.png");

		const content = {
			name,
			code,
			description: descriptionHtml,
			comments: commentsHtml,
			pngFlagPath: pngFlagFilePath.replace(/^data\//u, "/"),
			setupName
		};

		return context.render({
			content
		});
	}
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.content
 * @param props.data.content
 * @param props.data.content.name
 * @param props.data.content.code
 * @param props.data.content.pngFlagPath
 * @param props.data.content.description
 * @param props.data.content.setupName
 * @param props.data.content.comments
 */
const FlagDetails = ({
	data: {
		content: {
			name,
			code,
			pngFlagPath,
			description,
			setupName,
			comments
		}
	}
}) => (
	<section className="p-4 md:p-16 min-h-[calc(100vh-12rem)]">
		<h2 className="flex items-center h-24 gap-2">
			<span>{name}</span>
			<span className="text-base font-mono bg-neutral-700 px-1 py-0.5 rounded">({code})</span>
		</h2>

		<section className="flex flex-col sm:flex-row gap-4 min-h-[calc(100vh-26rem)]">
			<div className="flex items-start justify-center w-full min-h-full p-2 rounded bg-neutral-700">
				<img
					src={pngFlagPath}
					alt={`Flag of ${name} (according to ${setupName})`}
					className="max-w-full max-h-[max(16rem,calc(100vh-23rem))] border border-neutral-800"
					style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}
				/>
			</div>

			<div className="flex flex-col w-full min-h-full gap-4 p-4 rounded bg-neutral-700">
				<div className="flex flex-col gap-4 p-4 rounded bg-neutral-600">
					<h3 className="text-3xl font-medium">Description</h3>
					<section className="text-justify max-w-prose markdown"
						dangerouslySetInnerHTML={{ __html: String(description) }}
					/>
				</div>

				{comments && (
					<div className="flex flex-col gap-4 p-4 rounded bg-neutral-600">
						<h3 className="text-3xl font-medium">Comments</h3>
						<section className="text-justify max-w-prose markdown"
							dangerouslySetInnerHTML={{ __html: String(comments) }}
						/>
					</div>
				)}
			</div>
		</section>

	</section>
);

export { handler };

export default FlagDetails;
