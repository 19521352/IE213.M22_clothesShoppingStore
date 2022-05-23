const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

// mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Color = new Schema(
  {
    color_type: { type: String },
    color_hex: { type: String }
  }
)

const Size = new Schema(
  {
    size_type: { type: String, maxLength: 255, required: true },
    size_details: {
      h: { type: Number, set: function (v) { return Math.round(v) } },
      l: { type: Number, set: function (v) { return Math.round(v) } },
      w: { type: Number, set: function (v) { return Math.round(v) } }
    }
  }
)


const Sku = new Schema(
  {
    color: { type: Color },
    price: {
      base: { type: mongoose.Decimal128 },
      currency: { type: String },
      discount: { type: mongoose.Decimal128 }
    },
    quantity: { type: Number },
    size: { type: Size }
  },
  {
    timestamps: true,
  },
);

const Product = new Schema(
  {
    name: { type: String, maxLength: 255, required: true },
    categories: { type: String },// ( Shirt, skirt, jeans, accessories, shoes…. )
    description: { type: String },
    size_list: [
      { type: Size }
    ],
    color_list: [
      { type: Color }
    ],
    // price_range: {type: number},
    total_quantity: { type: Number },
    condition: { type: String },
    skus: [
      { type: Sku }
    ],
    image: [
      { type: String }
    ],
    slug: { type: String, slug: 'name', unique: true }
  },
  {
    timestamps: true,
  },
);

// Add plugin
mongoose.plugin(slug);
// Product.plugin(mongooseDelete, {
//   deletedAt: true,
//   overrideMethods: 'all',
// });

Product.post('save', (doc) => {
  // if (!this.skus) {
  //   console.log(this.name)
  //   // this.total_quantity = 0
  // }
  // else {
  //   console.log('b')
  //   this.total_quantity = (this.skus.map(d => d.quantity)).reduce((total, num) => total + num)
  //   this.color_list = groupByField(this.skus, 'color')
  //   this.size_list = groupByField(this.skus, 'size')
  // }
  console.log('post: ', doc)
})

function groupByField(object, field) {
  return object.reduce((r, a) => {
    // console.log("a", a);
    function index(obj, i) { return obj[i] }
    // return field.split('.').reduce(index, a)
    r[field.split('.').reduce(index, a)] = [...r[(field.split('.').reduce(index, a))] || [], a];
    return r;
  }, {});
}

module.exports = mongoose.model('Product', Product);
