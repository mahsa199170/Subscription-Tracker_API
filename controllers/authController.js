const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signUp = async (req, res, next) => {
  //   try {
  //     const { username, email, password } = req.body;
  //     const user = await User.signUp(email, username, password);
  //     res.status(201).json(user);
  //   } catch (error) {
  //     next(error); // Pass error to Express error middleware
  //   }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { username, password, email } = req.body;

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      const error = new Error('Username alreday exist');
      error.statusCode = 409;
      throw error;
    }
    if (existingEmail) {
      const error = new Error('Email alreday exist');
      error.statusCode = 409;
      throw error;
    }

    //validate password

    if (
      !password ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[@$!%*?&]/.test(password) ||
      !/\d/.test(password)
    ) {
      throw new Error(
        'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one digit, and one special character.'
      );
    }

    //hashing password

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const users = await User.create([{ email, username, password: hash }], {
      session,
    });

    const token = jwt.sign({ userId: users[0]._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED_IN,
    });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { token, users },
    });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(email, password);
    if (!user) {
      const error = new Error('User not found!');
      error.statusCode = 404;
      throw error;
    }

    const passIsValid = await bcrypt.compare(password, user.password);
    if (!passIsValid) {
      const error = new Error('Password is incorrect!');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED_IN,
    });
    res.status(200).json({
      success: true,
      message: 'user found successfully!',
      data: { user, token },
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const signOut = async (req, res, next) => {};

module.exports = { signIn, signOut, signUp };
