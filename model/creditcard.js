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
    },
    mode: {
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
    },
    reason: {
        type: String
    }
});

function validateCreditcardPay(entry) {
    const schema = Joi.object({
        date: Joi.date().required(),
        amount: Joi.number().required(),
        mode: Joi.string().required()
    });
    return schema.validate(entry);
}

function validateCreditcardUse(entry) {
    const schema = Joi.object({
        date: Joi.date().required(),
        amount: Joi.number().required(),
        reason: Joi.string().required()
    });
    return schema.validate(entry);
}

module.exports = { CreditCardPayModel, CreditCardUseModel, validateCreditcardPay, validateCreditcardUse }