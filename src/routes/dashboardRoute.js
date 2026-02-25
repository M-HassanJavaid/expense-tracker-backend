const express = require('express');
const { getOverview } = require('../controllers/dashboardController');
const dashboradRouter = express.Router();


dashboradRouter.get('/overview' , getOverview);

module.exports = dashboradRouter