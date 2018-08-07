'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const fs = require('fs');
const fse = require('node-fs-extra');
const path = require('path').posix;
const nodeUrl = require('url');

// enhanced logging
const mlog = require('./log');
const log = mlog.log;
const wlog = mlog.wlog;
const winstonStream = mlog.winstonStream;
const morgan = require('morgan');

// unique ID for each request
const genReqId = require('./requestId');
const getRandomNum = require('./getRandom');

const runCmd = require('./runCmd');
const imgColor = require('./imgColor');

// Create a new instance of express
const app = express();

// Max urls to process at one time
const maxUrlsToGet = 5000;

// cmd line args
const args = process.argv.slice(2);

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// setup Morgan and logging
app.use(genReqId);

// morgan logging format
const myLogFormat = `[:id] :remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms`;
morgan.token('id', req => req.id);

app.use(morgan(myLogFormat, {
	skip: (req, res) => (res.statusCode < 400),
	stream: winstonStream //process.stderr
}));

app.use(morgan(myLogFormat, {
	skip: (req, res) => (res.statusCode >= 400),
	stream: winstonStream //process.stdout
}));

const baseDir = 'wkdir';
const flist = 'filestoget.txt';
const imgName = 'imgs';

// computes a temporary work dir for each request
const getWorkDir = () => {
	const num = getRandomNum();
	const dir = path.join(baseDir, num.toString());

	return dir;
}

const cleanWorkDir = (req, res) => {
	fse.removeSync(res.locals.dirs.workDir);
}

const setupDirs = (req, res) => {
	const workDir = getWorkDir();
	res.locals.dirs = {
		workDir: workDir,
		imgDir: path.join(workDir, imgName)
	}
	cleanWorkDir(req, res);
	//console.log(`workDir:${res.locals.dirs.workDir}, imgDir:${res.locals.dirs.imgDir}`);
}

// removes all 0 byte files if any are present
const cleanBadFiles = async(req, res) => {
	const cmd = `find ${res.locals.dirs.imgDir} -size 0c -delete`;
	const output = await runCmd(cmd);
}

const getFilesSimple = async(list, req, res) => {
	wlog.info(`[${req.id}] --Start getFilesSimple`);

	//for (const f of list) console.log(`getFile: ${f}`);
	
	// makes a copy using ES6
	const names = [...list]; 

	names.push('\r');
	const data = names.join('\n');

	const filesToGet = path.join(res.locals.dirs.workDir, flist);
	fse.outputFileSync(filesToGet, data);

	//wlog.info(`[${req.id}] --Start getFiles:${filesToGet}`);
	fse.mkdirsSync(res.locals.dirs.imgDir);

	// call wget to do the download!
	const cmdGet = `wget --input-file=${filesToGet} --directory-prefix=${res.locals.dirs.imgDir} --content-disposition --trust-server-names`;

	// download files
	const output = await runCmd(cmdGet);

	// clean bad files
	const output2 = await cleanBadFiles(req, res);

	wlog.info(`[${req.id}] --End getFilesSimple`);
}



const doFinalCleanup = (req, res) => {
	cleanWorkDir(req, res);
	wlog.info(`[${req.id}] --Cleaned:${res.locals.dirs.workDir}`);
	res.locals.dirs = null;
}


const getImgColors = dir => new Promise(async(resolve, reject) => {
	const files = fse.readdirSync(dir);
	const promises = files.map(f => imgColor(path.join(dir, f)));
	const ret = await Promise.all(promises);

	resolve(ret);
});


// Downloads files and their image colors
const colorHandler = async(body, req, res) => {
	setupDirs(req, res);
	wlog.info(`[${req.id}] Start colorHandler wkdir:${res.locals.dirs.workDir} port:${PORT}`);

	try {
		const urls = body.urls;

		// async functions to get files and colors
		const downloads = await getFilesSimple(urls, req, res);
		
		//console.log('got files ' + downloads.files);
		
		const colors = await getImgColors(res.locals.dirs.imgDir);

		if (args[0] === 'skipClean') {
			wlog.info(`[${req.id}] Skip cleanup due to flag`);
		}
		else {
			doFinalCleanup(req, res);
		}
		wlog.info(`[${req.id}] End colorHandler\n`);

		return colors;
	}
	catch (err) {
		wlog.error(`[${req.id}] colorHandler Error:${err}`);
		doFinalCleanup(req, res);
	}
}



const sendResponse = (res, code, data, type = 'json') => {
	res.type(type)
		.status(code)
		.send(data)
		.end();
}

// Endpoint GET to get max Urls supported
app.get('/maxUrls', async(req, res, next) => {
	sendResponse(res, 200, { maxUrls: maxUrlsToGet });
});

// Endpoint POST to get image colors
app.post('/getImgColor', async(req, res, next) => {
	try {
		const body = req.body;

		if (!body.urls) {
			sendResponse(res, 404, 'Invalid Data', 'txt');
			return;
		}

		const urls = body.urls;
		if ((urls.length == 0) || (urls.length > maxUrlsToGet)) {
			sendResponse(res, 500, `Invalid input: urls.length:${urls.length} must be [1-${maxUrlsToGet}]`, 'txt');
			return;
		}

		const data = await colorHandler(body, req, res);
		sendResponse(res, 200, data);
	}
	catch (err) {
		wlog.error(`[${req.id}] getImgColor:Exception:${err}`);
		sendResponse(res, 503, err, 'txt');
	}
});



//const port = process.env.PORT || 3001;
// a neater way !!
const { PORT = 3001 } = process.env;

app.listen(PORT, err => {
	if (err) {
		throw err;
	}
	log(`*** Server started on port ${PORT} ***`);
});
