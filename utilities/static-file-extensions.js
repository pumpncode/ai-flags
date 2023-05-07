import { join } from "std/path";

const {
	readDir
} = Deno;

const fileExtensions = new Set();

const walk = async (folder) => {
	for await (const { name, isDirectory } of readDir(folder)) {
		if (isDirectory) {
			await walk(join(folder, name));
		}
		else {
			fileExtensions.add(name.split(".").at(-1));
		}
	}
};

await walk("./static");

export default fileExtensions;
