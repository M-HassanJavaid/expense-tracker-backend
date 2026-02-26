require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db.js');
const dns = require('node:dns');
const { authRouter } = require('./routes/authRoutes.js');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const cookieParser = require('cookie-parser');
const transactionRouter = require('./routes/transactionRoute.js');
const checkAuth = require('./middlewares/authMiddleware.js');
const dashboradRouter = require('./routes/dashboardRoute.js');


const app = express();
app.use(cors({
    origin: 'https://expense-tracker-frontend-eight-tau.vercel.app/',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('HEllo from express')
});

app.use('/api/v1/auth' , authRouter);
app.use('/api/v1/transaction' , checkAuth , transactionRouter);
app.use('/api/v1/dashboard' , checkAuth , dashboradRouter)

// Connect to database
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    })