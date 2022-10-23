const mongoose = require('mongoose');
const connectionInfo = mongoose.createConnection(process.env.infoServer);
const storeInfo = require('./schemas/Info/storeInfo');



module.exports = {
    getStoreLists: async function() {
        let results = await storeInfo.find({}).exec();
        let lists = results.map(result => result.storeID);
        let resultLists = lists.sort();
        return resultLists;
    },
    getStoreMenus: async function(storeID) {
        let result = await storeInfo.findOne(
            {
                'storeID': storeID
            }).exec();
        const arrayResult = Object.keys(result.menu);
        return {
            result: result.menu,
            arrayResult: arrayResult
        };
    },
}
//     getStoreLists: async function() {
//         const result = await connectionInfo.db.listCollections().toArray();
//         // const jsoneds = JSON.stringify(result);
//         // console.log(typeof(jsoneds));
//         const results = result.map(e => e.name);
//         const resultsLists = results.sort();
//         return results
//     },

//     getMenus: async function(storeID) {
//         const queryInput = { type: "menu" };
//         const storeCollection = connectionInfo.db.collection(`${storeID}`);
//         const result = await storeCollection.findOne(queryInput, {lean: true});
//         return result.menu;
//     },
// }