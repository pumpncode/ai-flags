const {
	Command,
	readTextFile
} = Deno;

const envFileContent = await readTextFile("./.env");

const envFileLines = envFileContent.split("\n");

for (const envFileLine of envFileLines) {
	const command = new Command(
		"fly",
		{
			args: [
				"secrets",
				"set",
				envFileLine
			]
		}
	);

	await command.output();
}
