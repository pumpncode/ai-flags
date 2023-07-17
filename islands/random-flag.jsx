import { Transition } from "@headlessui/react";
import cn from "classnames";
import { sample } from "lodash-es";
import { useEffect, useState } from "preact/hooks";

/**
 *
 * @param props
 * @param props.vexillologists
 * @param props.className
 * @param props.layout
 * @param props.interval
 * @param props.delay
 */
// eslint-disable-next-line max-lines-per-function
const RandomFlag = ({
	vexillologists,
	className,
	layout = "full",
	interval = 10_000,
	delay = 0,
	...props
}) => {
	const allFlags = vexillologists
		.map(({ name: vexillologistName, vexillographers }) => (
			vexillographers.map(({ name: vexillographerName, variants }) => (
				variants.map(({ name: variantName, instances }) => (
					instances.map(({ name: instanceName, flags }) => (
						flags.map((flag) => ({
							...flag,
							vexillologistName,
							vexillographerName,
							variantName,
							instanceName
						}))
					))
				))
			))
		))
		.flat(4);

	const [flag, setFlag] = useState(sample(allFlags));
	const [shown, setShown] = useState(true);

	useEffect(() => {
		const timeoutIds = [];
		const intervalIds = [];

		const delayTimeoutId = setTimeout(() => {
			const intervalId = setInterval(() => {
				setShown(false);

				const startTimeoutId = setTimeout(() => {
					setFlag(sample(allFlags));
				}, 1_100);

				const endTimeoutId = setTimeout(() => {
					setShown(true);
				}, 1_100);

				timeoutIds.push(startTimeoutId, endTimeoutId);
			}, interval);

			intervalIds.push(intervalId);
		}, delay);

		timeoutIds.push(delayTimeoutId);

		return () => {
			timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
			intervalIds.forEach((intervalId) => clearInterval(intervalId));
		};
	}, []);

	const {
		name,
		code,
		vexillologistName,
		vexillographerName,
		variantName,
		instanceName
	} = flag;

	const flagPathArray = [
		vexillologistName,
		vexillographerName,
		variantName,
		instanceName,
		code
	];

	const fullName = flagPathArray.join("/");

	const fullInstanceName = flagPathArray.slice(0, -1).join("/");

	const href = `/vexillologists/${fullName}`;

	const pngFlagPath = `/vexillologists/${fullName}/flag.png`;

	return (
		<div
			className={cn(
				{
					"h-[50vh]": layout === "full"
				},
				className
			)}
			{...props}
		>
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
				{
					layout === "full"
						? (
							<a href={href}>
								<figure className="flex flex-col items-center justify-between w-full h-full gap-1 p-2 border rounded border-neutral-600 bg-neutral-800 hover:bg-neutral-700">
									<div className="w-full flex items-center justify-center h-[35vh] p-2 bg-neutral-700 rounded">
										<img
											src={pngFlagPath}
											alt={`Flag of ${name} (according to ${fullInstanceName})`}
											className="max-w-full max-h-full border border-neutral-800"
											style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}
										/>
									</div>

									<figcaption className="h-[15vh] flex flex-col gap-1 items-center justify-center text-center">
										<span className="text-2xl">Flag of {name}</span>
										<span className="text-sm">(according to <span className="text-xs font-mono bg-neutral-700 px-1 py-0.5 rounded">{fullInstanceName}</span>)</span>
									</figcaption>
								</figure>
							</a>
						)
						: (
							<img
								src={pngFlagPath}
								alt={`Flag of ${name} (according to ${fullInstanceName})`}
								className="h-full"
								loading="lazy"
								decoding="async"
								fetchpriority="low"
							/>
						)
				}

			</Transition>

		</div>
	);
};

export default RandomFlag;
