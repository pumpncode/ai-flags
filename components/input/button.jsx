import { forwardRef } from "preact/compat";
import {
	css, cx, tx
} from "twind";

const Button = forwardRef((
	{
		children,
		variant = "contained",
		size = "md",
		className = "",
		loading = false,
		...props
	},
	ref
) => (
	<button
		ref={ref}
		type="button"
		className={tx`
			flex justify-center items-center cursor-pointer font-medium duration-300 rounded-[1em] px-[1em] py-[0.5em] disabled:(pointer-events-none cursor-default grayscale) focus:outline-none ${css({
		backgroundPosition: "0% 100%",
		backgroundSize: "400% 100%"
	})}
			hover:${css({ backgroundPosition: "100% 100%" })}
			${variant === "contained" && cx`bg-gradient2 text-white`}
			${variant === "transparent" &&
			cx`bg-none text-white hover:(bg(neutral-500 opacity-25))`
	}
			${size === "2xl" && cx`text-2xl`}
			${size === "xl" && cx`text-xl`}
			${className}
		`}
		{...props}
	>
		{children}
	</button>
));

export default Button;
