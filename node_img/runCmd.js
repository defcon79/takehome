const { exec } = require('child_process');
const log = require('./log').wlog;


const runCmd = cmd => new Promise((resolve, reject) => {
	//log.info(`RunCmd cmd:${cmd}`);
	if (!cmd) {
		reject('bad cmd');
		return;
	}

	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			//log.error(`exec error: ${err}`);
			resolve(err);
		}

		const ret = `${stdout}`;
		//log.info(`Cmd output:\n${ret}\n`);
		resolve(ret);
	});
});

module.exports = runCmd;