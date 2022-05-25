const { string } = require('handlebars-helpers/lib');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;x

const User = new Schema({
  _id: {type: String},
  email: {type: String},
  password: {type: String},
  name: {type: String},
});

module.exports = mongoose.model('User', User);