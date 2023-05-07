import { Temporal } from "@js-temporal/polyfill";

import InstancesListItem from "../../islands/instances-list-item.jsx";

const {
	Instant
} = Temporal;

/**
 *
 * @param props
 * @param props.instances
 * @param props.fullVariantName
 */
const InstancesList = ({ instances, fullVariantName }) => {
	const sortedInstancesArray = Object.entries(instances)
		.sort(([nameA, flagsA], [nameB, flagsB]) => {
			const sortedFlagsA = [...flagsA]
				.sort(({ createdAt: createdAtA }, { createdAt: createdAtB }) => Instant.compare(Instant.from(createdAtA), Instant.from(createdAtB)));

			const sortedFlagsB = [...flagsB]
				.sort(({ createdAt: createdAtA }, { createdAt: createdAtB }) => Instant.compare(Instant.from(createdAtA), Instant.from(createdAtB)));

			const firstFlagACreatedAt = Instant.from(sortedFlagsA[0].createdAt);
			const firstFlagBCreatedAt = Instant.from(sortedFlagsB[0].createdAt);

			return Instant.compare(firstFlagACreatedAt, firstFlagBCreatedAt);
		})
		.map(([name, flags]) => {
			const sortedFlags = [...flags]
				.sort(({ createdAt: createdAtA }, { createdAt: createdAtB }) => Instant.compare(Instant.from(createdAtA), Instant.from(createdAtB)));

			const startDate = Instant.from(sortedFlags[0].createdAt).toZonedDateTimeISO(Intl.DateTimeFormat().resolvedOptions().timeZone);

			return {
				name,
				flags,
				startDate
			};
		});

	return (
		<ul className="w-full">
			{
				sortedInstancesArray
					.map(({
						name, flags, startDate
					}) => (
						<InstancesListItem
							key={name}
							name={name}
							flags={flags}
							fullName={[fullVariantName, name].join("/")}
							startDate={startDate}
						/>
					))

			}
		</ul>
	);
};

export default InstancesList;
