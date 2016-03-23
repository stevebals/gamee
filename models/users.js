/**
 * Created by Bala on 22/3/2016.
 */
// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var usersSchema   = new mongoose.Schema({
    username: { type: String, lowercase: true },
    email: { type : String , required : true },
//    email: { type : String , unique : true, required : true },
    password: String,
    mobile : String,
    userId: String,
    isVerify :{ type: Boolean },
    token : String
});

// Export the Mongoose model
module.exports = mongoose.model('users', usersSchema);
