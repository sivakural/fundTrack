const mongoClient = require("mongodb").MongoClient;

const client = new mongoClient(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.h6gvicl.mongodb.net/?retryWrites=true&w=majority`);

const mongoConnect = async function () {
    try {
        await client.connect();
        // const db = client.db("fundTrack");
        console.log("FundTrack database connected");
        // await db.collection("entry").updateMany({},
        //     { 
        //         $set: { "user": "kalkinsiva@gmail.com" } 
        //     },
        //     { 
        //         upsert: true 
        //     });
        // console.log("updated document")
        // const list = await db.listCollections().toArray();

        // check collection exist else create collection
        // if (list.some((coll) => coll.name !== "entry")) {
        //     await client.db("fundTrack").createCollection("entry");
        // }
    } catch (error) {
        console.log(error);
    }
    finally {
        // await client.close();
    }
}

module.exports = { client, mongoConnect };