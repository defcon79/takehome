'use strict';

const lawyers = new Map();
const cases = new Map();
const hours = [];

const defaultRate = 300; // this is a high end law firm, everyone bills at least $300/hr !!

// add a new lawyer
const addLawyer = (name, rate = defaultRate) => {
    if (!lawyers.has(name)) {
        lawyers.set(name, rate);
        return `Added new laywer ${name} at rate ${rate}, total ${lawyers.size} lawyers`;
    }
}

// add a new case
const addCase = (name) => {
    if (!cases.has(name)) {
        // no one assigned
        const who = [];
        cases.set(name, who);
        return `Added new case ${name} total ${cases.size} cases`;
    }
}


const getLawyers = () => {
    let ret = [`total ${lawyers.size} lawyers`];
    for (const [name, rate] of lawyers) {
        ret.push(`Name: ${name}\tRate: ${rate}`);
    }
    return ret.join('\n');
}

const getCases = () => {
    let ret = [`total ${cases.size} cases`];
    for (const [name, who] of cases) {
        // list of lawyers on this case
        const list = who.length > 0 ? who.join(' ') : 'None';

        ret.push(`Name: ${name}\tAssigned Lawyers: ${list}`);
    }
    return ret.join('\n');
}



// add billable hours
const bill = (lawyer, caseId, time) => {
    // check input
    if (!caseId || !lawyer || !time || (time < 0)) return 'Invalid input';

    if (!cases.has(caseId)) return `Case ${caseId} not found`;
    if (!lawyers.has(lawyer)) return `Lawyer ${lawyer} not found`;

    // list of lawyers assigned to this case
    let who = cases.get(caseId);

    // assign lawyer to case if not already on the case
    if (who.indexOf(lawyer) === -1) {
        who.push(lawyer);
        cases.set(caseId, who);
    }

    const entry = {
        caseId: caseId,
        lawyer: lawyer,
        time: time
    }
    hours.push(entry);

    const rate = lawyers.get(lawyer);
    const txt = `Billed to lawyer:${lawyer} @ ${rate}/hour on case:${caseId}, ${time} hours`;
    
    return txt;
}


// This is a generic function that performs a kind of map/reduce on the list of timekeeping entries
// and computes the billable hours
//
// We use a default value of 'hours'
// and due to this other kinds of calls are much easier (see below)
const getBill = (entries = hours) => {
    // count total number of billable hours
    let ret = [];

    let total = 0;
    entries.forEach(entry => {
        const rate = lawyers.get(entry.lawyer);
        const val = rate * entry.time;
        total += val;

        //console.log('entry.lawyer ' + entry.lawyer + ' rate ' + rate);
        const txt = `Billed to lawyer:${entry.lawyer} @${rate}/hour on case:${entry.caseId}, ${entry.time} hours -> \$${val}\n`; 

        ret.push(txt);
    })

    ret.push(`-----------------------------------\nTotal Billable amount: \$${total}`);
    
    return {
        amount: total,
        msg: ret.join('\n')
    };
}

// by using functional programming, we can reuse the above code to make the other calls
// much cleaner and easily extensible for other use cases


const getBillForLawyer = (lawyer) => {
    if (!lawyers.has(lawyer)) return `There's no such lawyer`;

    return getBill(hours.filter(entry => entry.lawyer == lawyer));
}


const getBillForCase = (caseId) => {
    if (!cases.has(caseId)) return `There's no such case`;

    return getBill(hours.filter(entry => entry.caseId == caseId));
}


module.exports = {
    addLawyer: addLawyer,
    addCase: addCase,
    getLawyers: getLawyers,
    getCases: getCases,
    bill: bill,
    getBill, getBill,
    bill: bill,
    getBillForCase: getBillForCase,
    getBillForLawyer, getBillForLawyer
}

