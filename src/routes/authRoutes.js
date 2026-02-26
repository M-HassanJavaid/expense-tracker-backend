const express = require('express');
const { signup , login  , sendVerificationEmail , markUserVerify , isLogin, logout} = require('../controllers/authControllers.js');
const authRouter = express.Router();
const checkAuth = require('../middlewares/authMiddleware.js');
const upload = require('../middlewares/upload.js');



authRouter.post('/signup' , upload.single('image') , signup);
authRouter.post('/login' , login);
authRouter.put('/GetVerificationEmail'  , sendVerificationEmail );
authRouter.get('/markVerify' , markUserVerify)
authRouter.get('/isLogin' , checkAuth,  isLogin);
authRouter.put('/logout' , logout);


module.exports = {
    authRouter
}