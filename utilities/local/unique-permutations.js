const swapElements = (array, indexOne, indexTwo) => array.map((element, index) => {
	if (index === indexOne) {
		return array[indexTwo];
	}
	if (index === indexTwo) {
		return array[indexOne];
	}

	return element;
});

const reverseSuffix = (array, startIndex) => {
	if (startIndex === 0) {
		return array.toReversed();
	}

	let leftIndex = startIndex;
	let rightIndex = array.length - 1;
	let newArray = [...array];

	while (leftIndex < rightIndex) {
		newArray = swapElements(newArray, leftIndex, rightIndex);

		leftIndex += 1;
		rightIndex -= 1;
	}

	return newArray;
};

const nextPermutation = (array) => {
	const reversedIndices = [...Array(array.length).keys()].toReversed();
	const firstIndex = reversedIndices.slice(1).find((index) => array[index] < array[index + 1]);

	if (typeof firstIndex === "undefined") {
		return [array.toReversed(), false];
	}

	const secondIndex = reversedIndices.find((index) => array[firstIndex] < array[index]);
	let newArray = swapElements(array, firstIndex, secondIndex);

	newArray = reverseSuffix(newArray, firstIndex + 1);

	return [newArray, true];
};

/**
 *
 * @param array
 */
const uniquePermutations = (array) => {
	let sortedArray = array.toSorted();
	let hasNext = true;
	const permutations = new Set();

	while (hasNext) {
		permutations.add(sortedArray);
		[sortedArray, hasNext] = nextPermutation(sortedArray);
		if (permutations.size % 1000 === 0) {
			console.log(permutations.size);
		}
	}

	return permutations;
};

export default uniquePermutations;
