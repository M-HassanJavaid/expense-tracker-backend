const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getVerficationTemp = require('../utils/verificationEmailTemplate');
const nodemailer = require('nodemailer');
const cloudinaryUpload = require('../utils/cloudinaryUpload');
require('dotenv').config()

async function signup(req, res) {
    try {
        let { email, password, name } = req.body;
        console.log(req.body)

        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'One or more field is missing.'
            })
        }

        let isEmailExist = await User.findOne({ email });

        if (isEmailExist) {
            return res.status(409).json({
                success: false,
                message: "Email is already exist"
            })
        }

        let hashedPassword = await bcrypt.hash(password, 10);



        let newUser = new User({
            name,
            password: hashedPassword,
            email,
            isVerified: false,
            image: null
        });

        if (req.file && req.file.buffer) {
            try {
                let cloudinaryRes = await cloudinaryUpload(req.file.buffer, { folders: 'expenseTracker' });
                newUser.image = {};
                newUser.image.url = cloudinaryRes.secure_url;
                newUser.image.id = cloudinaryRes.public_id
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(400).json({
                    success: false,
                    message: 'Error uploading profile image: ' + uploadError.message
                })
            }
        }

        let savedUser = await newUser.save();
        delete savedUser.password;

        res.status(200).json({
            success: true,
            message: 'User has successfully signup!',
            user: savedUser
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

async function login(req, res) {
    try {
        let { email, password } = req.body || {};

        if (!email, !password) {
            return res.status(400).json({
                success: false,
                message: "One or more field is missing."
            })
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        let isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const token = jwt.sign({
            userId: user._id,
            isVerified: user.isVerified,
            name: user.name,
            email: user.email,
            image: user.image
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'User has successfully login.',
            user
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

async function sendVerificationEmail(req, res) {
    try {

        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'User is not login.'
            })
        };

        const user = jwt.verify(token, process.env.JWT_SECRET);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not login.'
            })
        }

        if (user.isVerified) {
            return res.status(200).json({
                success: false,
                message: 'User is already verified.'
            })
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let emailVerificationToken = jwt.sign({
            userId: user.userId
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await transporter.sendMail({
            from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Verify your account",
            html: getVerficationTemp(`http://localhost:8080/api/v1/auth/markVerify?token=${emailVerificationToken}`)
        });

        return res.status(200).json({
            success: true,
            message: 'Verification email has sent. Check your inbox or spam mail'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function markUserVerify(req, res) {
    try {
        const { token } = req.query;
        if (!token) throw new Error('Token is missing!');
        let decode = jwt.verify(token, process.env.JWT_SECRET);
        let { userId } = decode;
        let user = await User.findById(userId);
        if (!user) throw new Error('User not found!')
        if (user.isVerified) {
            return res.send('<h1>Your email is already verified.</h1> <p>Please wait we are redirecting...</p> <script> window.location.href = "https://www.google.com/?verified=true" </script>')
        }

        user.isVerified = true;
        await user.save();

        res.redirect('https://www.google.com/?verified=true');

    } catch (error) {
        res.send(error.message)
    }
};

async function isLogin(req , res) {

    console.log(req.user)

    res.status(200).json({
        success: true,
        isLogin: true,
        user: req.user
    })

}


function logout(req , res) {
    res.clearCookie('token');
    res.json({
        success: true,
        message: 'User has logout successfully'
    })
}

module.exports = {
    signup,
    login,
    sendVerificationEmail,
    markUserVerify,
    isLogin,
    logout
}