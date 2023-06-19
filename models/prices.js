const mongoose = require("mongoose");
const {Schema} = mongoose;
const pricesSchema = new Schema({
  id: Number,
  seat_class : String,
  min_price : String,
  normal_price : String,
  max_price : String
});

module.exports = mongoose.model("prices", pricesSchema);
