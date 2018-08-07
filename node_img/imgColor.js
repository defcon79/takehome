const fse = require('node-fs-extra');
const path = require('path').posix;
const log = require('./log').wlog;

const { promisify } = require('util');
const domColor = require('dominant-color');
const promiseDomColor = promisify(domColor);

// for mock
const getRandomNum = require('./getRandom');

const getFileDominantColor = async fpath => new Promise(async(resolve, reject) => {
    if (!fse.existsSync(fpath)) {
        reject(`${fpath} is not a valid file`);
        return;
    }

    try {
        // since the real code path for this needs additional graphic libs such as imagemagick
        // I am commenting this out for now
        //const color = await promiseDomColor(fpath);

        // mock it
        const color = getRandomNum(100, 500);

        resolve(color);
    }
    catch (err) {
        resolve(null);
    }
});

module.exports = getFileDominantColor;
