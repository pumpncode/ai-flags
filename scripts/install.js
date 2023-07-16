import npmDependencies from "./install/npm-dependencies.js";
import oxipng from "./install/oxipng.js";

await Promise.all([npmDependencies(), oxipng()]);

console.log("Done!");
