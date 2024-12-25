const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please enter your first name"]
  },
  lastname: {
    type: String,
    required: [true, "Please enter your last name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"]
  },
  adress: {
    type: String,
    required: [true, "Please enter your adress"]
  },
  city: {
    type: String,
    required: [true, "Please enter your city"]
  },
  state: {
    type: String,
    required: [true, "Please enter your state"]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"]
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"]
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
