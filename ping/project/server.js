'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const slackEnv = require('./slackenv');
const sendSlack = require('./slackUtils');
const {addLawyer, addCase, getLawyers, getCases, getBill, bill, getBillForLawyer, getBillForCase} = require('./data');

// create server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// helper functions
const isLawyer = str => (str === 'lawyers') || (str === 'lawyer') || (str === 'l');
const isCase = str => (str === 'cases')|| (str === 'case') || (str === 'c');



// Endpoint POST for getting data
app.post('/cmd/add', async(req, res, next) => {
	try {
        const slackPayload = req.body;

        // the params are in the form - 'add lawyer [name] [rate]' or 'add case [name]]'
        const params = slackPayload.text.split(' ');
        let ret;

        if (params.length === 0 || params[0] === '') {
            ret = 'Please provide either: add lawyer [name] [rate] or add case [name]';
        } else {
            const who = params[0].toLowerCase();
            const name = params[1];

            if (!name || name.length===0) {
                ret = 'You must provide a name';
            }

            if (isLawyer(who)) {
                const rate = params[2];
                ret = addLawyer(name, rate);                
            } else if (isCase(who)) {
                ret = addCase(name);                
            } else {
                ret = 'You can only add a case or lawyer !!';
            }
        }
        sendSlack(req, res, ret);
	}
	catch (err) {
        console.log('error ', err);
	}
});




// Endpoint POST for getting data
app.post('/cmd/show', async(req, res, next) => {
	try {
        const slackPayload = req.body;
        const who = slackPayload.text.toLowerCase();
        let ret = '';

        if (isLawyer(who)) {
            ret = getLawyers();
        } else if (isCase(who)) {
            ret = getCases();
        } else {
            ret = 'Please ask for either Lawyers or Cases';
        }

        sendSlack(req, res, ret);
	}
	catch (err) {
        console.log('error ', err);
	}
});



// Endpoint POST for billing
app.post('/cmd/bill', async(req, res, next) => {
	try {
        const slackPayload = req.body;

        // the params are in the form - 'bill [lawyer] [case] [hours]'
        const params = slackPayload.text.split(' ');
        let ret;

        if (params.length !== 3) {
            ret = 'Please provide: bill [lawyer] [case] [hours]';
        } else {
            const lawyer = params[0];
            const caseId = params[1];
            const time = params[2];

            ret = bill(lawyer, caseId, time);
        }
        sendSlack(req, res, ret);
	}
	catch (err) {
        console.log('error ', err);
	}
});

// use a dummy image service
const makeBillImage = x => `https://dummyimage.com/500x200/000/fff&text=\$${x}`;


// the Getbill api's publish only to that specific user and not channel
// they also add a nice image

app.post('/cmd/getbill', async(req, res, next) => {
	try {
        const slackPayload = req.body;
        let ret = getBill();
        const attach = [{
            image_url: makeBillImage(ret.amount)
        }]

        sendSlack(req, res, ret.msg, attach, false);
	}
	catch (err) {
        console.log('error ', err);
	}
});



app.post('/cmd/getbillforlawyer', async(req, res, next) => {
	try {
        const slackPayload = req.body;
        const who = slackPayload.text;
        let ret = getBillForLawyer(who);
        const attach = [{
            image_url: makeBillImage(ret.amount)
        }]

        sendSlack(req, res, ret.msg, attach, false);
	}
	catch (err) {
        console.log('error ', err);
	}
});


app.post('/cmd/getbillforcase', async(req, res, next) => {
	try {
        const slackPayload = req.body;
        const who = slackPayload.text;
        let ret = getBillForCase(who);
        const attach = [{
            image_url: makeBillImage(ret.amount)
        }]

        sendSlack(req, res, ret.msg, attach, false);
	}
	catch (err) {
        console.log('error ', err);
	}
});




// Endpoint POST for test 'hi'
app.post('/cmd/hi', async(req, res, next) => {
	try {
        const slackPayload = req.body;

        const msg = `Hi ${slackPayload.user_name} on channel ${slackPayload.channel_name} from Pingy !!`;
        sendSlack(req, res, msg);
	}
	catch (err) {
        console.log('error ', err);
	}
});




// default port
const { PORT = 3000 } = process.env;

const server = app.listen(PORT, err => {  
	if (err) {
		throw err;
	}
	console.log(`*** Pingy started on port ${PORT} ***`);    
});