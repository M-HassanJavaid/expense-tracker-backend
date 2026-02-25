const jwt = require('jsonwebtoken');
require('dotenv').config();

async function checkAuth(req, res, next) {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'User is not login.',
                isLogin: false
            })
        };

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('deconde')
        console.log(decode)

        if (!(decode.isVerified)) {
            return res.status(200).json({
                success: false,
                message: 'You are not verified!',
                isLogin : true,
                user: decode
            })
        }

        req.user = decode;
        
        console.log(req.user)// ✅ now you can access req.user in protected routes

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = checkAuth ;