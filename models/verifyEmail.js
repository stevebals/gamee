var mongoose = require('mongoose');

// Define our beer schema
var verifyEmail   = new mongoose.Schema({
    email: { type : String , unique : true, required : true },
    userId: String,
    token: { type : String , unique : true, required : true }
});

// Export the Mongoose model
module.exports = mongoose.model('verifyEmail', verifyEmail);