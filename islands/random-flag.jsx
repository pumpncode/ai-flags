import { Transition } from "@headlessui/react";
import { sample } from "lodash-es";
import { useEffect, useState } from "preact/hooks";
import { css, cx } from "twind";

import { asset } from "$fresh/runtime.ts";

/**
 *
 * @param props
 * @param props.vexillologists
 */
const RandomFlag = ({ vexillologists }) => {
	const allFlags = Object.values(vexillologists)
		.map((vexillologist) => Object.entries(vexillologist)
			.filter(([name]) => name !== "wikipedia")
			.map(([name, vexillographer]) => Object.values(vexillographer)
				.map(({ instances }) => Object.values(instances))))
		.flat(4);

	const [flag, setFlag] = useState(sample(allFlags));
	const [shown, setShown] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setShown(false);

			setTimeout(() => {
				setFlag(sample(allFlags));
			}, 1_100);

			setTimeout(() => {
				setShown(true);
			}, 1_100);
		}, 10_000);

		return () => clearInterval(interval);
	}, []);

	const {
		name,
		code,
		pngFlagPath
	} = flag;

	const instanceName = pngFlagPath.replace(new RegExp(`^setups\\/(.*?)\\/${code}\\/flag\\.png$`, "u"), "$1");

	const href = `${instanceName}/${code}`;

	return (
		<div className="h-[50vh]">
			<Transition
				appear={true}
				show={shown}
				enter="transition-opacity duration-1000"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-1000"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				className="h-full"
			>
				<a href={href}>
					<figure className="flex flex-col gap-1 w-full h-full justify-between items-center p-2 border border-neutral-600 rounded bg-neutral-800 hover:bg-neutral-700">
						<div className="w-full flex items-center justify-center h-[35vh] p-2 bg-neutral-700 rounded">
							<img
								src={asset(pngFlagPath)}
								alt={`Flag of ${name} (according to ${instanceName})`}
								loading="lazy"
								className={cx`
									max-w-full max-h-full border border-neutral-800
									${css({ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" })}
								`}
							/>
						</div>

						<figcaption className="h-[15vh] flex flex-col gap-1 items-center justify-center text-center">
							<span className="text-2xl">Flag of {name}</span>
							<span className="text-sm">(according to <span className="text-xs font-mono bg-neutral-700 px-1 py-0.5 rounded">{instanceName}</span>)</span>
						</figcaption>
					</figure>
				</a>
			</Transition>

		</div>
	);
};

export default RandomFlag;
