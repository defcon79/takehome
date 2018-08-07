const winston = require("winston");
const fse = require('node-fs-extra');
const path = require('path').posix;

const logPath = './logs';
const logFile = path.join(logPath, 'node.log');
fse.mkdirsSync(logPath);

const level = process.env.LOG_LEVEL || 'debug';
const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: level,
			timestamp: tsFormat,
			colorize: true,
			showLevel: false,
			handleExceptions: true
		}),
		new winston.transports.File({
            level: 'info',
            filename: logFile,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
        	colorize: false
        })
	],
	exitOnError: false
});

const winstonStream = {
    write: (message, encoding) => {
        logger.info(message);
    }
};

const log = (...args) => {
    console.log.apply(this, args);
}

module.exports = {
	log: log,
	wlog: logger,
	winstonStream: winstonStream
}

//module.exports.wlog = logger;
