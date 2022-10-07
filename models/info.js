const mongoose = require('mongoose');
const connection = mongoose.createConnection('mongodb://localhost:27017/InfoStores');

module.exports = {
    getLists: async function(req, res, next) {
        const result = await connection.db.listCollections().toArray();
        // const jsoneds = JSON.stringify(result);
        // console.log(typeof(jsoneds));
        const results = result.map(e => e.name);
        console.log(results.sort());
        next();
    }}