import { decode } from "imagescript";

const {
	readFile
} = Deno;

const imageFile = await readFile("./static/setups/chatgpt/1/ala/flag.png");

const { bitmap } = await decode(imageFile);

console.log(bitmap);
