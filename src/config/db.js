const mongoose = require('mongoose')
require('dotenv').config()
async function connectDB() {
    console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected!')
}

module.exports = connectDB