const mongoose = require("mongoose");

var seatSchemaSchema = mongoose.Schema({
    id : Number,
    seat_identifier : String,
    seat_class : String,
    isBooked:Boolean
})


module.exports = mongoose.model("seat", seatSchemaSchema);