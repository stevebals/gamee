/**
 * Created by HP on 9/5/2015.
 */
// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var resetPwdTokenSchema   = new mongoose.Schema({
    email: String,
    token: String,
    expire: String
});

// Export the Mongoose model
module.exports = mongoose.model('resetPwdToken', resetPwdTokenSchema);
