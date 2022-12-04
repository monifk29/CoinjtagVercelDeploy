const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email : {type : String , required : true},
    password : {type : String , required : true},
    Incorrect_Count : {type : Number},
    Date : { type : String },
    current_hour : {type : Number},
    current_minute : {type : Number}
});
let UserSchema = mongoose.model("users",userSchema);

module.exports = UserSchema