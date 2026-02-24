require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db.js')


const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ["GET" , "POST" , "PUT" , "DELETE"],
    allowedHeaders:  ["Content-Type" , "Authorization"]
}));

app.use(express.json());

app.get('/' , (req ,res)=>{
    res.send('HEllo from express')
});

connectDB()
.then(()=>{
    app.listen(PORT , ()=>{
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})
