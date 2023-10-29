const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  type: {
    type: String,
    enum: ['user', 'vendor'],
    required: true,
  },

});

const User = mongoose.model('User', userSchema);

module.exports = User;