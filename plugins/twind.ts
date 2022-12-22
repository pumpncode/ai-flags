import { stringify } from "twind";
import { Plugin } from "$fresh/server.ts";

import { Options, setup, STYLE_ELEMENT_ID } from "./twind/shared.ts";
export type { Options };

export default function twind(options: Options): Plugin {
  const instance = setup(options);
  const main = `data:application/javascript,import hydrate from "${
    new URL("./twind/main.ts", import.meta.url).href
  }";
import options from "${options.selfURL}";
export default function() { hydrate(options); }`;
  return {
    name: "twind",
    entrypoints: { "main": main },
    render(ctx) {
      const res = ctx.render();
      const cssText = stringify(instance.target);
      const scripts = [];
      if (res.requiresHydration) {
        scripts.push({ entrypoint: "main", state: [] });
      }
      return {
        scripts,
        styles: [{ cssText, id: STYLE_ELEMENT_ID }],
      };
    },
  };
}
