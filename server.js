var mongoose = require('mongoose');
const { Router } = require("express");
const app = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, validateUser, validateLoginUser } = require('./model/user');

const mongoConnect = async function () {
    try {
        await mongoose.connect("mongodb+srv://siva:Mongodb%4025@cluster0.h6gvicl.mongodb.net/userEntry?retryWrites=true&w=majority")
        console.log('User database connected...')
    } catch (error) {
        console.log(error)
    }
}

mongoConnect();

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
                return res.status(400).json('User cannot exist..').end();
            }
        } else {
            return res.status(400).json('User cannot exist..').end();
        }
    } catch (error) {
        return res.status(400).json('User cannot exist..').end();
    }
});

module.exports = app;
