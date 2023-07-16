import "std/dotenv/load";

import { gpt4GeneratorTemplate } from "@/utilities/local.js";

/**
 *
 * @param country
 * @param country.name
 */
const generator = gpt4GeneratorTemplate({ completionParams: { temperature: 0.5 } });

export default generator;
