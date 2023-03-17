const mongoClient = require("mongodb").MongoClient;
const client = new mongoClient(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.h6gvicl.mongodb.net/?retryWrites=true&w=majority`);
// const client = new mongoClient("mongodb+srv://siva:Mongodb%4025@cluster0.h6gvicl.mongodb.net/?retryWrites=true&w=majority");

const mongoConnect = async function () {
    try {
        await client.connect();
        console.log("FundTrack database connected");
    } catch (error) {
        console.log(error);
    }
    finally {
        // await client.close();
    }
}

module.exports = { client, mongoConnect };