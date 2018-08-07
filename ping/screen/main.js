const csv = require('csvtojson');

// data sources
const fileMatters = 'Matters.csv';
const fileTime = 'TimeEntries.csv';
const fileClients = 'Clients.csv';

// the actual data
let timeJson, clientsJson, mattersJson;

// time is a map from timeid -> time struct
// same for client

let client = new Map();
let time = new Map();
let matters = new Map();

// function addClient({id, name, code, updatedAt}) {
//     if (!id) return;

//     // lookup client entry for this O(1)
//     if (client.has(id)) {
//         return;
//     }

//     client.add(id, {name, code, updatedAt});
// }

// function addTime({id,clientId,matterId,description,updatedAt}) {
//     if (!id) return;

//     // lookup client entry for this O(1)
//     if (client.has(id)) {
//         return;
//     }

//     client.add(id, {name, code, updatedAt});

// }

function store (obj, ds, field = '') {
    if (!obj.id) return;

    if (!ds.has(obj.id)) {
        ds.set(obj.id, obj);
    }

    // check if object has changed
    const cur = ds.get(obj.id);

    if (cur.updatedAt < obj.updatedAt) {

    }
}

const add = (data, ds) => {
    for (const o of data) {
        store(o, ds);
    }
}


const dump = (ds) => {
    for (const [key, val] of ds) {
        console.log(`${key}: ${JSON.stringify(val)}`);
    }
}


const getMatter = (timeId) => {
    const timeEntry = time.get(timeId);
    if (!timeEntry) return null;

    // lookup mattter
    const ret = matters.get(timeEntry.matterId);
    return ret;
}

const loadData = async () => {
    clientsJson = await csv().fromFile(fileClients);
    timeJson = await csv().fromFile(fileTime);
    mattersJson = await csv().fromFile(fileMatters);

    add(clientsJson, client);
    add(timeJson, time, 'matterId');
    add(mattersJson, matters);

    //dump(time);

    const test = getMatter('e9230a70-730c-11e8-adc0-fa7ae01bbebc');
    console.log(JSON.stringify(test));
}


async function run() {
    loadData();


}


run();