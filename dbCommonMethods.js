const { client } = require('./databaseConnector');
const db = client.db("fundTrack");
const { getWeek, getMonth, getYear, handleThings } = require('./utils');
const jwt = require('jsonwebtoken');

async function handleCommon(req) {
    let query = req.query;
    console.log("query: ", query.type)
    let result = [];
    let getQuries = [];
    switch (query.type) {
        case "week":
            getQuries = getWeek();
            await handleDataFlow(getQuries, result, req);
            getQuries = [];
            break;
        case "month":
            getQuries = getMonth();
            await handleDataFlow(getQuries, result, req);
            getQuries = [];
            break;
        case "year":
            getQuries = getYear();
            await handleDataFlow(getQuries, result, req);
            getQuries = [];
            break;
        default:
            // get auth and set id to relation record
            const userId = getId(req);
            result = await db.collection("entry").find({user: userId._id}).sort({ date: -1 }).toArray();
            break;
    }
    return result;
}

async function handleDataFlow(getQuries, result, req) {
    for (let i = 0; i < getQuries.length; i++) {
        let saveRecord;
        // get auth and set id to relation record
        const userId = getId(req);
        if (!userId) return result;
        let record = await db.collection("entry").find({ date: { $gte: getQuries[i].startDate, $lte: getQuries[i].endDate }, user: userId._id }).toArray();
        if (record.length) {
            for (let j = 0; j < record.length; j++) {
                if (!saveRecord) {
                    saveRecord = record[j];
                    continue;
                } else {
                    let getResult = handleThings(record[j], saveRecord);
                    saveRecord = getResult;
                }
            }
            result.push(saveRecord);
        }
    }
}

function getId(req) {
    if (req.headers && req.headers.authorization) {
        const authorization = req.headers.authorization;
        var decodedId;
        try {
            decodedId = jwt.verify(authorization, 'SecureAF')
        } catch (error) {
            return false;
        }
        return decodedId;
    } else {
        return false;
    }
}

module.exports = { handleCommon, getId }