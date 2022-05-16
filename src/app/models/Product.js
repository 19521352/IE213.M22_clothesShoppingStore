const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');

// mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Sku = new Schema(
  {
    color: {
      color: { type: String },
      colorHex: { type: String }
    },
    price: {
      base: { type: mongoose.Decimal128 },
      currency: { type: String },
      discount: { type: mongoose.Decimal128 }
    },
    quantity: { type: Number },
    size: {
      size_type: { type: String, maxLength: 255, required: true },
      size_details: {
        h: { type: Number, set: function (v) { return Math.round(v) } },
        l: { type: Number, set: function (v) { return Math.round(v) } },
        w: { type: Number, set: function (v) { return Math.round(v) } }
      }
    },
    image: [
      { type: String }
    ]
  },
  {
    timestamps: true,
  },
);

const Product = new Schema(
  {
    name: { type: String, maxLength: 255, required: true },
    categories: [  // ( Shirt, skirt, jeans, accessories, shoes…. )
      { type: String }
    ],
    description: String,
    features: [{
      type: String
    }],
    // size_range: {type: String},
    // price_range: {type: number},
    total_quantity: { type: Number },
    condition: String,
    skus: [
      { type: Sku }
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Product', Product);
