const Joi = require('joi');
const mongoose = require('mongoose');
const UserModel = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});

function validateUser(user) {    
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(user);
}

function validateLoginUser(user) {    
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(user);
}

module.exports = { UserModel, validateUser, validateLoginUser };