const mongoClient = require("mongodb").MongoClient;
const { fundTrackDBURL } = require('./config');
const client = new mongoClient(fundTrackDBURL);
const mongoConnect = async function () {
    try {
        await client.connect();
        console.log("FundTrack database connected");
        // handle admin operations
        // const db = client.db();
        // let result = await db.collection('entry').updateMany({
        //     "things.subcategories.subcategorey": "Others",
        //     },
        //     {
        //         $set: { "things.$.subcategories.$[].subcategorey": "Extras" }
        //     });
        // console.log("result; ", result);
    } catch (error) {
        console.log(error);
    }
    finally {
        // await client.close();
    }
}

module.exports = { client, mongoConnect };