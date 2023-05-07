import { IconCopyright, IconHeartFilled } from "@tabler/icons-preact";

import Link from "../base/link.jsx";

/**
 *
 */
const Footer = () => (
	<footer className="flex flex-col items-center justify-between h-24 px-6 py-4 bg-neutral-900 sm:flex-row sm:px-12">
		<span className="flex text-white gap-1">
			<span>Made with </span>
			<span className="text-red-500"><IconHeartFilled color="red" stroke={0} /></span>
			<span> by <Link to="https://github.com/nnmrts" target="_blank">Nano Miratus</Link></span>
		</span>
		<span className="flex text-white gap-1">
			<IconCopyright />
			<span> 2023 Pumpn Code</span>
		</span>
	</footer>
);

export default Footer;
