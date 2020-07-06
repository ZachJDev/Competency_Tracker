const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name: String,
  password: String,
  defaultReadOnly: {
    type: Boolean,
    default: false,
  },
  // In the creation logic, the CommentOnly Permission will only be set to 'true' if
  // readOnly is true.
  defaultCommentOnly: {
    type: Boolean,
    default: true,
  },
});

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;
