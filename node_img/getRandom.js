const getRandomInt = (min = 1, max = 99999) => {
	const rmin = Math.ceil(min);
	const rmax = Math.floor(max);
	const rand = Math.floor(Math.random() * (rmax - rmin + 1)) + rmin; //The maximum is inclusive and the minimum is inclusive 

	return rand;
}

module.exports = getRandomInt;