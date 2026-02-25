const Transaction = require("../Models/transactions");
const mongoose = require('mongoose');
const User = require("../Models/User");

async function getOverview(req, res) {
    try {
        let userId = req.user.userId;

        let user = await User.findById(userId);

        let [overview] = await Transaction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.userId) } },
            {
                $group: {
                    _id: null,

                    expense: {
                        $sum: {
                            $cond: [
                                { $eq: ["$action", "expense"] },
                                "$value",
                                0
                            ]
                        }
                    },

                    income: {
                        $sum: {
                            $cond: [
                                { $eq: ["$action", "income"] },
                                "$value",
                                0
                            ]
                        }
                    }

                }
            }
        ])



        res.status(200).json({
            success: true,
            message: 'overviews has send!',
            overview: {
                expense: overview?.expense || 0,
                income: overview?.income || 0,
                totalBalance: user.totalBalance
            }
        })

        console.log({overview: {
            expense: overview?.expense || 0,
            income: overview?.income || 0,
            totalBalance: user.totalBalance
        }})
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getOverview,
}