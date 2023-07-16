import InstancesListItem from "../../islands/instances-list-item.jsx";

/**
 *
 * @param props
 * @param props.vexillologistName
 * @param props.vexillographerName
 * @param props.variantName
 * @param props.instances
 */
const InstancesList = ({
	vexillologistName,
	vexillographerName,
	variantName,
	instances
}) => (
	<ul className="w-full bg-white bg-opacity-5">
		{
			instances
				.map(({
					name: instanceName,
					score,
					flags
				}) => (
					<InstancesListItem
						key={instanceName}
						{...{
							vexillologistName,
							vexillographerName,
							variantName,
							instanceName,
							score,
							flags
						}}
					/>
				))

		}
	</ul>
);

export default InstancesList;
