const getRandomNum = require('./getRandom');

module.exports = (req, res, next) => {
	req.id = getRandomNum(1, 5000);
	next();
}
