const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minLength: [2, '{VALUE} is too short for a name!'],
      maxLength: [50, '{VALUE} is too long for a name!'],
      lowercase: true,
      trim: true,
      required: [true, 'username is required'],
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please fill a valid email address',
      ],
      required: [true, 'Email address is required'],
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: [true, 'Password is required'],
    },
  },
  { timestamps: true }
);

//create sttaic signup method//hash password

// userSchema.statics.signUp = async function (email, username, pass) {
//   // if (!email || !pass || !username) {
//   //   throw new Error('All fields are required!');
//   // }

//   const existingEmail = await this.findOne({ email });
//   const existingUsername = await this.findOne({ username });

//   if (existingUsername) {
//     throw new Error('Username already exists! Enter another value');
//   }
//   if (existingEmail) {
//     throw new Error('Email already exists! Enter another value');
//   }

//   if (
//     !pass ||
//     pass.length < 8 ||
//     !/[A-Z]/.test(pass) ||
//     !/[a-z]/.test(pass) ||
//     !/[@$!%*?&]/.test(pass) ||
//     !/\d/.test(pass)
//   ) {
//     throw new Error(
//       'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one digit, and one special character.'
//     );
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(pass, salt);

//     const user = await new this({
//       email,
//       username,
//       password: hash,
//     });

//     await user.save();

//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

//signIn static method

module.exports = mongoose.model('User', userSchema);
