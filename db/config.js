const mongoose = require("mongoose");

let connection = mongoose.connect("mongodb+srv://monif:Finom1234@cluster0.gocvx.mongodb.net/coinDB")


module.exports = {connection}