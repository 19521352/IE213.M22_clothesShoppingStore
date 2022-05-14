const { string } = require('handlebars-helpers/lib');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const Comments = new Schema({
  name: {type: String},
  email: {type: String},
  comment: {type: String, minlength: 10},
  rate: {type: Number, min:0, max:5, default:5},
  productId: {type: String, required: true},
}, {
  timestamps: true,
}
);

module.exports = mongoose.model('comments', Comments);