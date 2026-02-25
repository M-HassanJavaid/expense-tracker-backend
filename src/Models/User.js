const mongoose = require('mongoose');
const validator = require('validator')

const imageSchema = new mongoose.Schema({
    
    id: {
        type: String,
        required: true
    },

    url:{
        type: String,
        required:true
    }

} , {_id: false})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },

    email: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Email is not valid'
        }
    },

    password: {
        type: String,
        required: true,
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    image: {
        type: imageSchema,
        default: null
    },

    totalBalance: {
        type: Number,
        default: 0
    }
    
} , { timestamps: true })



const User = mongoose.model("User" , userSchema , "users");

module.exports = User;