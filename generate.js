import { join } from "std/path";

const {
	args: [setupNamesString, countryCodesFilterString],
	cwd,
	readTextFile,
	run,
	writeTextFile
} = Deno;

const setupNames = setupNamesString?.split(",") ?? [];

if (setupNames.length === 0) {
	console.error("Please provide one or multiple setup names");
	Deno.exit(1);
}

for (const setupName of setupNames) {
	const savedSetupNames = JSON.parse(await readTextFile(join(cwd(), "setup-names.json")));

	if (!savedSetupNames.includes(setupName)) {
		await writeTextFile(
			join(cwd(), "setup-names.json"),
			JSON.stringify(
				[...savedSetupNames, setupName],
				null,
				"\t"
			)
		);
	}

	const setupPath = join(cwd(), "generators", setupName);

	const command = [
		"deno",
		"run",
		"-A",
		"--unstable",
		`${setupPath}.js`
	];

	const process = run({
		cmd: countryCodesFilterString
			? [...command, countryCodesFilterString]
			: command
	});

	await process.status();
}
