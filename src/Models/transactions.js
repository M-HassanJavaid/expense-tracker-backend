const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    value: {
        type: Number,
        required: true
    },

    source: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    icon: {
        default: '📌',
        type: String
    },

    action: {
        type: String,
        required: true,
        enum: ['income' , 'expense']
    },

    description:{
        type: String
    }
});

const Transaction = mongoose.model('Transaction' , transactionSchema , 'transactions');
module.exports = Transaction;

