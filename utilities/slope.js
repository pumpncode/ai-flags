import roundToThousands from "./round-to-thousands.js";

const slope = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => roundToThousands((y2 - y1) / (x2 - x1));

export default slope;