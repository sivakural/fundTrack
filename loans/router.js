const { getId } = require('../dbCommonMethods');
const { PersonalLoan } = require('./dbConnector');

const { Router } = require("express");
const app = Router();
const { validatePersonalLoan } = require('./model');


app.post('/addpersonaloan', async (req, res) => {
    // get auth and set id to relation record
    const userId = getId(req);
    if (!userId) return res.status(401).send("Unauthorized...");
    req.body.user ? "" : req.body.user = userId._id;

    // First validate the req
    const { error } = validatePersonalLoan(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const loan = new PersonalLoan({
        date: new Date(req.body.date),
        amount: req.body.amount,
        user: req.body.user
    });

    await loan.save();
    console.log("Loan entry done....");
    return res.status(200).end();
});

app.get('/getpersonaloan', async (req, res) => {
    // get auth and set id to relation record
    const userId = getId(req);
    let result = await PersonalLoan.findOne({ date: req.query.date, user: userId._id });
    console.log("Get loan done....");
    return res.status(200).send(result).end();
});

app.get('/listpersonaloan', async (req, res) => {
    // get auth and set id to relation record
    const userId = getId(req);
    let result = await PersonalLoan.find({ user: userId._id }).sort({ date: -1 });
    console.log("Loan list done....");
    return res.status(200).send(result).end();
});

app.delete('/deletepersonaloan', async (req, res) => {
     // get auth and set id to relation record
     const userId = getId(req);
     console.log('date: ', req.query.date)
     let result = await PersonalLoan.deleteOne({ date: req.query.date, user: userId._id });
     console.log("Loan delete done....");
     return res.status(200).send(result).end();
});

module.exports = app;