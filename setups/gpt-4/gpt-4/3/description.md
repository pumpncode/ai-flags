We prompt ChatGPT (GPT-4, temperature set to 0.5) this to get the flag description:

> Describe the flag of ${name}! Provide color codes, aspect ratio, geometric properties and measurements, and any other relevant information! Don't include a description of the flag's symbolism!

After it responds, we ask it to write SVG markup for the flag like this:

> Please give me a precise SVG markup for that flag!

The response then gets trimmed to only include the SVG markup. It then gets optimized using svgo and other simplifying and sanitizing algorithms. This process fails if the resulting SVG markup is found to be invalid.
