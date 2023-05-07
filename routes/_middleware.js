import { join } from "std/path";

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
	const { pathname } = new URL(url);

	context.state.isStatic = pathname.startsWith("/_frsh/");

	if (!context.state.isStatic) {
		try {
			await stat(join("./static", pathname.replace(/^\//u, "")));

			context.state.isStatic = true;
		}
		catch (error) {
			context.state.isStatic = false;
		}
	}

	return context.next();
};

export { handler };
