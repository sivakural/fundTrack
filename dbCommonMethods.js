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
            result = await db.collection("entry").find({ user: userId._id }).sort({ date: -1 }).toArray();
            break;
    }
    return result;
}

async function handleDataFlow(getQuries, result, req) {
    for (let i = 0; i < getQuries.length; i++) {
        // get auth and set id to relation record
        const userId = getId(req);
        if (!userId) return result;
        let record = await db.collection("entry").aggregate([
            {
                $match: {
                    $and: [
                        {
                            date: { $gte: getQuries[i].startDate, $lte: getQuries[i].endDate }
                        },
                        {
                            user: userId._id
                        }
                    ]
                }
            },
            { $unwind: "$things" },
            {
                $group: {
                    _id: "$things.categorey",
                    date: { $first: "$date" },
                    total: { $sum: "$things.categorey_value" },
                    subcategories: { $push: "$things.subcategories" }
                }
            },
            {
                $project: {
                    categorey: "$_id",
                    categorey_value: "$total",
                    subcategories: {
                        $reduce: {
                            input: "$subcategories",
                            initialValue: [],
                            in: {
                                $concatArrays: ["$$value", "$$this"]
                            }
                        }
                    }
                }
            }
        ]).toArray();
        if (record.length) {
            let obj = {
                date: getQuries[i].endDate,
                user: userId._id,
                things: []
            }
            obj.things = record;
            result.push(obj);
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