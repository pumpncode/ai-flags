import { forwardRef } from "preact/compat";
import cn from "classnames";

const Button = forwardRef((
	{
		children,
		variant = "contained",
		size = "base",
		className = "",
		loading = false,
		...props
	},
	ref
) => (
	<button
		ref={ref}
		type="button"
		className={cn(
			"button flex justify-center items-center cursor-pointer font-medium duration-300 rounded-[1em] px-[1em] py-[0.5em] disabled:(pointer-events-none cursor-default grayscale) focus:outline-none",
			{
				"bg-gradient2 text-white": variant === "contained",
				"bg-none text-white hover:(bg(neutral-500 opacity-25))": variant === "transparent",
				"text-2xl": size === "2xl",
				"text-xl": size === "xl",
				"text-base": size === "base",
				"text-sm": size === "sm"
			},
			className
		)}
		{...props}
	>
		{children}
	</button>
));

export default Button;
