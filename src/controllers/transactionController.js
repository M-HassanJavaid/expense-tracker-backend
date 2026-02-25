const mongoose = require("mongoose");
const Transaction = require("../Models/transactions");
const User = require("../Models/User");

async function addTransaction(req, res) {
    try {
        let { source, value, date, icon = '📌', description, action } = req.body;

        if (!source, !value, !date, !action) {
            return res.status(400).json({
                success: false,
                message: 'One or more field missing'
            })
        }

        if (!(['income', 'expense'].includes(action))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action'
            })
        }



        let newTransaction = new Transaction({
            source,
            value,
            user: req.user.userId,
            icon ,
            date: new Date(date).toISOString(),
            description,
            action 
        });

        console.log(newTransaction.icon)

        let savedTransaction = await newTransaction.save();

        let user = await User.findById(req.user.userId);
        if (action === 'income') {
            user.totalBalance = user.totalBalance + Number(value);
        } else if (action === 'expense') {
            user.totalBalance = user.totalBalance - Number(value);
        }

        await user.save();

        res.status(201).json({
            success: true,
            message: `New ${action} has recorded`,
            newTransaction: savedTransaction
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function deleteTransaction(req, res) {
    try {
        let id = req.params.id;
        let isDelete = await Transaction.findOneAndDelete(
            {
                _id: new mongoose.Types.ObjectId(id),
                user: new mongoose.Types.ObjectId(req.user.userId)
            }
        );
        if (!isDelete) {
            return res.status(200).json({
                success: false,
                message: 'Invalid transaction id'
            })
        }

        console.log(isDelete)

        return res.status(200).json({
            success: true,
            message: `Transaction: ${isDelete.action} has deleted successfully`
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


async function updateTransaction(req, res) {
    try {
        let { source, value, date, icon, description } = req.body;

        if (Object.keys(req.body).length === 0 || !req.body) {
            return res.status(400).json({
                success: false,
                message: 'No update provided.'
            })
        }

        let id = req.params.id;

        let currentTransaction = await Transaction.findOne({
            _id: new mongoose.Types.ObjectId(id),
            user: new mongoose.Types.ObjectId(req.user.userId)
        });

        if (!currentTransaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            })
        }

        if (source) currentTransaction.source = source;
        if (value) currentTransaction.value = value;
        if (date) currentTransaction.date = new Date(date).toISOString();
        if (icon) currentTransaction.icon = icon;
        if (description) currentTransaction.description = description;

        let updatedTransaction = await currentTransaction.save();

        return res.status(200).json({
            success: false,
            message: `Transaction : ${currentTransaction.type} has updated successfull.`,
            updatedTransaction
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function getAllTransactions(req, res) {
    try {

        let action = req.query.action;
        let limit = req.query.limit;

        if (!(['income' , 'expense'].includes(action)) && action) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action'
            })
        }

        let filters = {
            user: new mongoose.Types.ObjectId(req.user.userId)
        }

        if (action) filters.action = action

        let transactions = limit ? (
            await Transaction.find(filters).sort({date: -1}).limit(Number(limit))
        ) : await Transaction.find(filters).sort({date: -1})

        res.status(200).json({
            success: true,
            message: 'All',
            transactions
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getAllTransactions
}