const mongoose = require('mongoose');
const connectionInfoStores = mongoose.createConnection('mongodb://localhost:27017/InfoStores');

module.exports = {
    getStoreLists: async function() {
        const result = await connectionInfoStores.db.listCollections().toArray();
        // const jsoneds = JSON.stringify(result);
        // console.log(typeof(jsoneds));
        const results = result.map(e => e.name);
        const resultsLists = results.sort();
        return resultsLists
    }}