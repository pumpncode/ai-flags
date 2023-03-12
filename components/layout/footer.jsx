import { IconCopyright, IconHeartFilled } from "@tabler/icons-preact";

import Link from "../base/link.jsx";

/**
 *
 */
const Footer = () => (
	<footer className="bg-neutral-900 h-24 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 py-4">
		<span className="text-white flex gap-1">
			<span>Made with </span>
			<span className="text-red-500"><IconHeartFilled color="red" stroke={0} /></span>
			<span> by <Link to="https://github.com/nnmrts" target="_blank">Nano Miratus</Link></span>
		</span>
		<span className="text-white flex gap-1">
			<IconCopyright />
			<span> 2023 Pumpn Code</span>
		</span>
	</footer>
);

export default Footer;
