This setup first prompts OpenAI's `text-davinci-003` model to generate a description for a flag, then prompts OpenAI's `code-davinci-002` with a JavaScript comment of this description to generate a SVG markup inside a template literal.

We first prompt OpenAI's `text-davinci-003` model this to generate a description for a flag:

> The following is a conversation with an expert vexillologist. They know all of the flags of the world, can describe them to you in detail and tell you their aspect ratio. They answer with a precise geometrical description of the flag.
>
> Me: Describe the flag of ${name}.
> Vexillologist:

Then we prompt OpenAI's `code-davinci-002` with the start of JavaScript code like so, using the result from above as `description`:

> ```js
> // ${description} Here is a precise visualization of it in the form of SVG code:`
>
> const html = `
>   <svg xmlns="http://www.w3.org/2000/svg" viewBox
> ```

The response then gets trimmed to only include the SVG markup. It then gets optimized using svgo and other simplifying and sanitizing algorithms. This process fails if the resulting SVG markup is found to be invalid.
