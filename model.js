// Requiring module
const mongoose = require('mongoose');

// Entry modal schema
const entrySchema = new mongoose.Schema({
    date: Date,
    things: []
});

// Credit_Card modal scema
const creditCardSwipeSchema = new mongoose.Schema({
    date: Date,
    swipe: Number
});

const creditCardPaySchema = new mongoose.Schema({
    date: Date,
    pay: Number
});


// Creating model objects
const Entry = mongoose.model('entry', entrySchema);
const Credit_Card_Swipe = mongoose.model("creditcardswipe", creditCardSwipeSchema);
const Credit_Card_Pay = mongoose.model("creditcardpay", creditCardPaySchema);

// Exporting our model objects
module.exports = { Entry, Credit_Card_Swipe, Credit_Card_Pay }