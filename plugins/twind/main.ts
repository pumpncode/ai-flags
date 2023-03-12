import { getSheet } from "twind";
import { Options, setup, STYLE_ELEMENT_ID } from "./shared.ts";

export default async function hydrate(options: Options) {
  const sheet = getSheet(true, false);
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  sheet.target = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement;
  setup(options, sheet);
}
