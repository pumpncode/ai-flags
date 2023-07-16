const {
	Command
} = Deno;

/**
 *
 */
const installNpmDependencies = async () => {
	console.log("[Installing npm dependencies] ...");

	const command = new Command(
		"npm",
		{
			args: ["install"]
		}
	);

	await command.output();

	console.log("[Installing npm dependencies] Done!");
};

export default installNpmDependencies;
