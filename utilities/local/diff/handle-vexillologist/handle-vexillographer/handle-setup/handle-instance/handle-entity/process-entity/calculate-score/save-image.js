const {
	writeFile
} = Deno;

/**
 *
 * @param filePath
 * @param image
 */
const saveImage = async (filePath, image) => {
	const outputData = await image.encode();

	await writeFile(filePath, outputData);
};

export default saveImage;
