const joi = require('joi');
const mongoose = require('mongoose');
const PersonalLoanModel = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

function validatePersonalLoan(entry) {
    const result = joi.object({
        date: joi.date().required(),
        amount: joi.number().required(),
        user: joi.string().required()
    });

    return result.validate(entry);
}

module.exports = { PersonalLoanModel, validatePersonalLoan }