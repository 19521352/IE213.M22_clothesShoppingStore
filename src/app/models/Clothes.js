const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');

// mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Clothes = new Schema(
  {
    name: { type: String, maxLength: 255, required: true },
    clothes: { type: String, maxLength: 255, required: true },
    image: { type: String, maxLength: 255, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Clothes', Clothes);
