const Joi = require('joi');
const mongoose = require('mongoose');
const CreditCardPayModel = new mongoose.Schema({
    date: {
        type: Date,
        requied: true
    },
    amount: {
        type: Number,
        requied: true
    },
    user: {
        type: String
    }
});

const CreditCardUseModel = new mongoose.Schema({
    date: {
        type: Date,
        requied: true
    },
    amount: {
        type: Number,
        requied: true
    },
    user: {
        type: String
    }
});

function validateCreditcard(entry) {
    const schema = Joi.object({
        date: Joi.date().required(),
        amount: Joi.number().required()
    });
    return schema.validate(entry);
}

module.exports = { CreditCardPayModel, CreditCardUseModel, validateCreditcard }