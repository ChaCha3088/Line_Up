const mongoose = require('mongoose');
const connectionInfoStores = mongoose.createConnection(process.env.infoServer);

module.exports = {
    getStoreLists: async function() {
        const result = await connectionInfoStores.db.listCollections().toArray();
        // const jsoneds = JSON.stringify(result);
        // console.log(typeof(jsoneds));
        const results = result.map(e => e.name);
        const resultsLists = results.sort();
        return results
    },

    getMenus: async function(storeID) {
        const queryInput = { type: "menu" };
        const storeCollection = connectionInfoStores.db.collection(`${storeID}`);
        const result = await storeCollection.findOne(queryInput, {lean: true});
        return result.menu;
    },
}