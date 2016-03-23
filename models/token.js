/**
 * Created by HP on 9/5/2015.
 */
// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var tokenSchema   = new mongoose.Schema({
    email: String,
    token: String,
    inTime: String,
    expire: String
});

// Export the Mongoose model
module.exports = mongoose.model('token', tokenSchema);
