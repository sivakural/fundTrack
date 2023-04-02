
const { Router } = require("express");
const app = Router();
const { client } = require('./databaseConnector');
const db = client.db();
const { handleThings, formatDate } = require('./utils');
const { handleCommon, getId } = require('./dbCommonMethods');

app.post('/entry', async (req, res) => {
    let inputs = req.body;

    // get auth and set id to relation record
    const userId = getId(req);
    if (!userId) return res.status(401).send("Unauthorized...");
    inputs.user ? "" : inputs.user = userId._id;

    let dbResult = await db.collection("entry").findOne({ date: formatDate(inputs.date), user: inputs.user });

    // store result arrary into temp
    inputs = handleThings(dbResult, inputs);

    await db.collection("entry").updateOne(
        { date: formatDate(inputs.date), user: inputs.user },
        {
            $set: inputs
        },
        { upsert: true }
    );
    console.log("Data inserted....");
    res.status(200).end();
});

app.put('/update', async (req, res) => {
    let inputs = req.body;
    // get auth and set id to relation record
    const userId = getId(req);
    if (!userId) return res.status(401).send("Unauthorized...");
    inputs.user ? "" : inputs.user = userId._id;

    let result = await db.collection("entry").updateOne(
        { date: formatDate(inputs.date), user: inputs.user },
        {
            $set: inputs
        }
    );
    console.log("Updated selected data....")
    res.status(200).send(result).end();
});

app.get('/tracklist', async (req, res) => {
    let result = await handleCommon(req);
    console.log("get list of data....")
    res.status(200).send(result).end();
});

app.post('/getentry', async (req, res) => {
    // get auth and set id to relation record
    const userId = getId(req);
    if (!userId) return res.status(401).send("Unauthorized...");
    let user = userId._id;

    let result = await db.collection("entry").findOne({date: formatDate(req.body.date), user: user });
    console.log("get selected data....")
    res.status(200).send(result).end();
});

module.exports = app;