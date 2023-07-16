const {
	stat
} = Deno;

/**
 *
 * @param request
 * @param request.url
 * @param context
 */
const handler = async ({ url }, context) => {
	try {
		return context.next();
	}
	catch {
		return new Response(
			"Error",
			{
				stats: 500,
				statusText: "Internal Server Error"
			}
		);
	}
};

export { handler };
