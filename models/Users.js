const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  hashedPassword: String,
  institution: String,
  institutionName: String,
  permissions: {},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
