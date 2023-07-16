/**
 *
 * @param svg
 */
const removeXlink = (svg) => svg.replace(/xlink:/gu, "");

export default removeXlink;
