const dotenv = require('dotenv');
dotenv.config();
port = process.env.PORT;
fundTrackDBURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.h6gvicl.mongodb.net/fundTrack?retryWrites=true&w=majority`;
userDBURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.h6gvicl.mongodb.net/userEntry?retryWrites=true&w=majority`;
creditCardDBURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.h6gvicl.mongodb.net/creditCard?retryWrites=true&w=majority`;
loansDBURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.h6gvicl.mongodb.net/loans?retryWrites=true&w=majority`;

module.exports = { fundTrackDBURL, creditCardDBURL, userDBURL, loansDBURL, port };