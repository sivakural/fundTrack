const { createConnection } = require('mongoose');
const { Router } = require("express");
const app = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel, validateUser, validateLoginUser } = require('./model/user');
const { CreditCardPayModel, CreditCardUseModel, validateCreditcardPay, validateCreditcardUse } = require('./model/creditcard');
const { getId } = require('./dbCommonMethods');

// Database connections
// const db1 = createConnection("mongodb+srv://siva:Mongodb%4025@cluster0.h6gvicl.mongodb.net/userEntry?retryWrites=true&w=majority");
const db1 = createConnection(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.h6gvicl.mongodb.net/userEntry?retryWrites=true&w=majority`);
const User = db1.model("User", UserModel);
console.log('User database connected...')
// const db2 = createConnection("mongodb+srv://siva:Mongodb%4025@cluster0.h6gvicl.mongodb.net/creditCard?retryWrites=true&w=majority");
const db2 = createConnection(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.h6gvicl.mongodb.net/creditCard?retryWrites=true&w=majority`);
const CreditCardPay = db2.model("CreditCardPay", CreditCardPayModel);
const CreditCardUse = db2.model("CreditCardUse", CreditCardUseModel);
console.log('Creditcard database connected...');

// Handle user records
app.post('/register', async (req, res) => {
    // First validate the req
    console.log(req.body)
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    // Check if the user already exist
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send("That user already exists..");
    } else {
        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        const token = jwt.sign({ _id: user.email }, "SecureAF");
        return res.setHeader("Access-Control-Expose-Headers", "Authorization").header('Authorization', token).status(200).end();
    }
});

app.post('/login', async (req, res) => {
    try {
        // First validate the req
        console.log(req.body)
        const { error } = validateLoginUser(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (validPassword) {
                const token = jwt.sign({ _id: user.email }, "SecureAF");
                return res.setHeader("Access-Control-Expose-Headers", "Authorization").header('Authorization', token).status(200).end();
            } else {
                return res.status(400).json('Password does not match..').end();
            }
        } else {
            return res.status(400).json('User cannot exist..').end();
        }
    } catch (error) {
        return res.status(400).json('Server error...').end();
    }
});

// Handle Credit card section records
app.post('/creditcarduse', async (req, res) => {
    // First validate the req
    const { error } = validateCreditcardUse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // get auth and set id to relation record
    const userId = getId(req);
    if (!userId) return res.status(401).send("Unauthorized...");
    req.body.user ? "" : req.body.user = userId._id;

    const creditCard = new CreditCardUse({
        date: new Date(req.body.date),
        amount: req.body.amount,
        user: req.body.user,
        reason: req.body.reason
    });
    await creditCard.save();
    return res.status(200).end();
});

app.put('/creditcarduseupdate', async (req, res) => {
    // First validate the req
    const { error } = validateCreditcardUse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // get auth and set id to relation record
    const userId = getId(req);
    if (!userId) return res.status(401).send("Unauthorized...");
    req.body.user ? "" : req.body.user = userId._id;

    let result = await CreditCardUse.findOneAndUpdate(
        { date: req.body.date, user: req.body.user, reason: req.body.reason },
        { $set: req.body });
    return res.status(200).send(result).end();
});

app.post('/creditcardpay', async (req, res) => {
    // First validate the req
    const { error } = validateCreditcardPay(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // get auth and set id to relation record
    const userId = getId(req);
    if (!userId) return res.status(401).send("Unauthorized...");
    req.body.user ? "" : req.body.user = userId._id;

    const creditCard = new CreditCardPay({
        date: new Date(req.body.date),
        amount: req.body.amount,
        user: req.body.user,
        mode: req.body.mode
    });
    await creditCard.save();
    return res.status(200).end();
});

app.get('/getCreditCardUsedlist', async (req, res) => {
    // get auth and set id to relation record
    const userId = getId(req);
    let result = await CreditCardUse.find({ user: userId._id }).sort({ date: -1 });
    return res.status(200).send(result).end();
});

app.get('/getcreditcarduse', async (req, res) => {
    // get auth and set id to relation record
    const userId = getId(req);
    let result = await CreditCardUse.findOne({ date: req.query.date, user: userId._id });
    return res.status(200).send(result).end();
});

app.get('/getcreditcardpay', async (req, res) => {
    // get auth and set id to relation record
    const userId = getId(req);
    let result = await CreditCardPay.findOne({ date: req.query.date, user: userId._id });
    return res.status(200).send(result).end();
});

app.delete('/deletecreditcardpay', async (req, res) => {
    // get auth and set id to relation record
    const userId = getId(req);
    let result = await CreditCardPay.deleteOne({ date: req.query.date, user: userId._id });
    return res.status(200).send(result).end();
});

app.delete('/deletecreditcarduse', async (req, res) => {
    // get auth and set id to relation record
    const userId = getId(req);
    let result = await CreditCardUse.deleteOne({ date: req.query.date, amount: req.query.amount, user: userId._id });
    return res.status(200).send(result).end();
});

app.get('/getCreditCardPayslist', async (req, res) => {
    // get auth and set id to relation record
    const userId = getId(req);
    let result = await CreditCardPay.find({ user: userId._id }).sort({ date: -1 });
    return res.status(200).send(result).end();
});

module.exports = app;
