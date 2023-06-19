const mongoose = require("mongoose");

exports.connectDb = () =>{
    mongoose.connect("mongodb+srv://sushant:sushant8083@cluster0.likejge.mongodb.net/?retryWrites=true&w=majority")
    .then(()=>{
        console.log("Database connected successfully!")
    })
    .catch((err)=>{
        console.log(err);
    })
}