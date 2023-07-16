import roundToDecimalPlaces from "@/utilities/shared/round-to-decimal-places.js";

/**
 *
 * @param point1
 * @param point1.x
 * @param point1.y
 * @param point2
 * @param point2.x
 * @param point2.y
 */
const slope = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => roundToDecimalPlaces((y2 - y1) / (x2 - x1), 3);

export default slope;
