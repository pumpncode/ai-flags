import { supabase } from "@/utilities/server.js";

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				vexillologist,
				vexillographer,
				variant,
				instance,
				code,
				file
			}
		} = context;

		const filePathOnBucket = [
			"vexillologists",
			vexillologist,
			vexillographer,
			variant,
			instance,
			code,
			file
		]
			.join("/");

		const { data: { publicUrl } } = supabase
			.storage
			.from("images")
			.getPublicUrl(filePathOnBucket);

		return new Response(
			null,
			{
				status: 301,
				headers: new Headers({
					Location: publicUrl
				})
			}
		);
	}
};

export {
	handler
};
