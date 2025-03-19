const User = require('../model/userModel');
const bcrypt = require('bcrypt');

//get user info
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      const error = new Error('User Not Found!');
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//getting all users info
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// const postUser = async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;

//     const user = await User.signUp(email, username, password);
//     res.json(user);
//   } catch (error) {
//     // res.status(400).json({ message: error.message });
//     next(error);
//   }
// };

//updating user information
const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { username, password } = req.body;

    //hashing password

    if (!id) {
      return res.status(400).json({ message: 'no such id' });
    }

    const foundUser = await User.findOne({ _id: id });

    if (username) foundUser.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      foundUser.password = hash;
    }

    await foundUser.save();

    return res
      .status(200)
      .json({ message: 'user information updatetd succusseffully' });
  } catch (error) {
    next(error);
  }
};

//removing a user
const deletetUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete({ _id: id });

    if (!deletedUser) {
      return res.status(404).json({ message: 'no such user found' });
    }

    return res.status(200).json({ message: 'deleted succesfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, getUsers, updateUser, deletetUser };
