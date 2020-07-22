const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
  },
  hashedPassword: String,
  institution: String,
  institutionName: String,
  permissions: {},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
