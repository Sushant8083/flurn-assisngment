const mongoose = require("mongoose");

var bookingSchemaSchema = mongoose.Schema({
    seats : [{
        type : Number
    }],
    phoneNumber : Number,
    userName : String,
    email : String,
    totalAmount : Number
})


module.exports = mongoose.model("booking", bookingSchemaSchema);