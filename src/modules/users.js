const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        minlength : 3,
        required : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : [true , "Email id already present"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new console.error("Invalid Email");
            }
        }
    },
    password :{
        type : String,
        required : true,
        minlength : 6
    },
    userName : {
        type : String,
        required : true,
        unique : true
    },
    age : {
        type : Number,
        required : true
    },
    DOB : {
        type : Number,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    }
})

const User = new mongoose.model('User', userSchema);
module.exports = User;