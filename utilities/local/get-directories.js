const {
	readDir
} = Deno;

/**
 *
 * @param dirPath
 */
const getDirectories = async (dirPath) => {
	const dirs = [];

	for await (const { name, isDirectory } of readDir(dirPath)) {
		if (isDirectory) {
			dirs.push(name);
		}
	}

	return dirs;
};

export default getDirectories;
