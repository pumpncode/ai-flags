import { TbHeartFilled, TbCopyright } from "react-icons/tb";

import Link from "../base/link.jsx";

/**
 *
 */
const Footer = () => (
	<footer className="flex flex-col items-center justify-between h-24 px-6 py-4 bg-neutral-900 sm:flex-row sm:px-12">
		<span className="flex gap-1 text-white">
			<span>Made with </span>
			<span className="text-red-500"><TbHeartFilled size={24} color="red" stroke={0} /></span>
			<span> by <Link to="https://github.com/nnmrts" target="_blank">Nano Miratus</Link></span>
		</span>
		<span className="flex gap-1">
			<Link to="/legal/disclosure">Impressum</Link>
			<Link to="/legal/privacy">Datenschutz</Link>
		</span>
		<span className="flex gap-1 text-white">
			<TbCopyright size={24} />
			<span>2023 Pumpn Code</span>
		</span>
	</footer>
);

export default Footer;
