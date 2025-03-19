const express = require('express');
const authorize = require('../middleware/authMiddleware');
const User = require('../model/userModel');
const {
  getUser,
  getUsers,
  postUser,
  updateUser,
  deletetUser,
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', authorize, getUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deletetUser);

module.exports = userRouter;
