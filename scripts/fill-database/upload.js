import { extname } from "std/path";
import { contentType } from "std/media_types";

import { supabase } from "@/utilities/local.js";

/**
 *
 * @param options
 * @param options.filePath
 * @param options.filePathOnBucket
 */
const upload = async ({
	filePath,
	filePathOnBucket
}) => {
	const {
		readFile
	} = Deno;

	const imageFileContent = await readFile(filePath);

	const imageFile = new File(
		[imageFileContent],
		filePathOnBucket,
		{
			type: contentType(extname(filePath))
		}
	);

	const { error } = await supabase
		.storage
		.from("images")
		.upload(
			filePathOnBucket,
			imageFile,
			{
				upsert: true
			}
		);

	if (error) {
		throw error;
	}
};

export default upload;
