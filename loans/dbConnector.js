const { createConnection } = require('mongoose')
const { loansDBURL } = require('../config');
const { PersonalLoanModel } = require('./model');

// Database connections
const db = createConnection(loansDBURL);
const PersonalLoan = db.model('PersonalLoan', PersonalLoanModel);
console.log('loan database connected...');

module.exports = { PersonalLoan };