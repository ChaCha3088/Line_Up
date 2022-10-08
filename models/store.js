const mongoose = require('mongoose');
const connectionInfoStores = mongoose.createConnection('mongodb://localhost:27017/InfoStores');

module.exports = {
    getMenus: async function(req, res, next) {
        const storeCollection = await connectionInfoStores.collection(`AAA`);
        console.log(storeCollection);
        next();
    }}