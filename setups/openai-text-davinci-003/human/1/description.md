We first prompt OpenAI's `text-davinci-003` model this to generate a description for a flag:

> The following is a conversation with an expert vexillologist. They know all of the flags of the world, can describe them to you in detail and tell you their aspect ratio. They answer with a precise geometrical description of the flag.
>
> Me: Describe the flag of ${name}.
> Vexillologist:

We then create SVG markup of the flag based on the description generated.
