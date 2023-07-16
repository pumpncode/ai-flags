const {
	Command,
	build: {
		os
	}
} = Deno;

/**
 *
 */
const installOxipng = async () => {
	console.log("[Installing oxipng] ...");

	switch (os) {
		case "darwin": {
			const command = new Command(
				"brew",
				{
					args: ["install", "oxipng"]
				}
			);

			await command.output();

			break;
		}

		case "linux": {
			const updateCommand = new Command(
				"apk",
				{
					args: ["update"]
				}
			);

			await updateCommand.output();

			const installCommand = new Command(
				"apk",
				{
					args: [
						"add",
						"--upgrade",
						"oxipng"
					]
				}
			);

			await installCommand.output();

			break;
		}

		default: {
			throw new Error(`[Installing oxipng]: Unsupported OS: ${os}`);
		}
	}

	console.log("[Installing oxipng] Done!");
};

export default installOxipng;
