const mongoose = require('mongoose');
const connectionInfoStores = mongoose.createConnection('mongodb://localhost:27017/InfoStores');
const AAA = require('../models/schemas/InfoStores/AAA');
const nal = require('../models/schemas/InfoStores/nal');

module.exports = {
    getMenus: async function(storeID) {
        const queryInput = { type: "menu" };
        const storeCollection = connectionInfoStores.db.collection(`${storeID}`);
        const result = await storeCollection.findOne(queryInput, {lean: true});
        return result.menu;
    }
}