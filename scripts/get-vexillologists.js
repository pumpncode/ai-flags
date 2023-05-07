import { Command } from "cliffy";
import { join } from "std/path";

import { getVexillologists } from "@ai-flags/utilities";

const {
	args
} = Deno;

const rootFolderPath = join("./");

const setupsFolderPath = join(rootFolderPath, "setups");

const staticFolderPath = join(rootFolderPath, "static");

const staticSetupsFolderPath = join(staticFolderPath, "setups");

const { options: { format } } = await new Command()
	.name("get-vexillologists")
	.version("0.1.0")
	.description("Get all vexillologists")
	.option(
		"-f, --format <format:string>",
		"output format",
		{ default: "json" }
	)
	.parse(args);

const vexillologists = await getVexillologists({
	setupsFolderPath,
	staticSetupsFolderPath
});

switch (format) {
	case "json":
		console.log(
			JSON.stringify(
				vexillologists,
				null,
				"\t"
			)
		);
		break;
	case "names":
		console.log(
			Object.entries(vexillologists)
				.map(([vexillologistName, vexillographers]) => [
					Object.entries(vexillographers)
						.map(([vexillographerName, variants]) => [
							Object.entries(variants)
								.map(([variantName, variant]) => [
									Object.keys(variant.instances)
										.map((instanceName) => [
											vexillologistName,
											vexillographerName,
											variantName,
											instanceName
										]
											.join("/"))
								])
						])
				])
				.flat(6)
				.join(",")
		);
		break;
	default:
		break;
}
