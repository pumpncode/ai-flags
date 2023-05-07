We prompt ChatGPT (GPT-3.5) this to get the flag description:

> Describe the flag of ${name}! Provide color codes, aspect ratio, geometric properties and measurements, and any other relevant information! Don't include a symbolic description of the flag's features!

After it responds, we ask it to write SVG markup for the flag like this:

> Please give me a precise SVG markup for that flag, using the `xmlns` and `viewBox` attributes and only integers for all number values if possible, otherwise use decimals!

The response then gets trimmed to only include the SVG markup. It then gets optimized using svgo and other simplifying and sanitizing algorithms. This process fails if the resulting SVG markup is found to be invalid.
