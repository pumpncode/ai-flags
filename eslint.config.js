import config, { deno } from "@pumpn/eslint-config";

export default [
	...config,
	deno,
	{
		ignores: ["static/**"]
	}
];
