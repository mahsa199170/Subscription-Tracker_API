const express = require('express');

const { signUp, signIn, signOut } = require('../controllers/authController');
const authorize = require('../middleware/authMiddleware');

const authRouter = express.Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);

module.exports = authRouter;
