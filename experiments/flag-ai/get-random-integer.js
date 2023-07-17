/**
 *
 * @param minimum
 * @param maximum
 */
const getRandomInteger = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

export default getRandomInteger;
