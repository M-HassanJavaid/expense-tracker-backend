const express = require('express');
const { addTransaction, deleteTransaction, updateTransaction , getAllTransactions } = require('../controllers/transactionController');
const transactionRouter = express.Router();


transactionRouter.post('/add' , addTransaction);
transactionRouter.delete('/delete/:id' , deleteTransaction);
transactionRouter.put('/update/:id' , updateTransaction);
transactionRouter.get('/get/all' , getAllTransactions );

module.exports = transactionRouter;
