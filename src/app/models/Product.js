const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

// mongoose.plugin(slug);

const Schema = mongoose.Schema

const Color = new Schema({
  color_type: { type: String },
  color_hex: { type: String },
})

const Size = new Schema({
  size_type: { type: String, maxLength: 255, required: true },
  size_details: {
    h: {
      type: Number,
      set: function (v) {
        return Math.round(v)
      },
    },
    l: {
      type: Number,
      set: function (v) {
        return Math.round(v)
      },
    },
    w: {
      type: Number,
      set: function (v) {
        return Math.round(v)
      },
    },
  },
})

const Sku = new Schema(
  {
    color: { type: Color },
    price: {
      base: { type: mongoose.Decimal128 },
      currency: { type: String },
      discount: { type: mongoose.Decimal128 },
    },
    quantity: { type: Number },
    size: { type: Size },
  },
  {
    timestamps: true,
  }
)

const Product = new Schema(
  {
    name: { type: String, maxLength: 255, required: true },
    categories: { type: String }, // ( Shirt, skirt, jeans, accessories, shoes…. )
    description: { type: String },
    size_list: [{ type: String }],
    color_list: [{ type: String }],
    // price_range: {type: number},
    price: {
      currency: { type: String },
      minPrice: { type: mongoose.Decimal128 },
      maxPrice: { type: mongoose.Decimal128 },
      minPriceBase: { type: mongoose.Decimal128 },
      maxPriceBase: { type: mongoose.Decimal128 },
    },
    total_quantity: { type: Number },
    condition: { type: String },
    skus: [{ type: Sku }],
    skusLength: { type: Number },
    image: [{ type: String }],
    slug: { type: String, slug: 'name', unique: true },
  },
  {
    timestamps: true,
  }
)

// Add plugin
mongoose.plugin(slug)
// Product.plugin(mongooseDelete, {
//   deletedAt: true,
//   overrideMethods: 'all',
// });

Product.pre("findOneAndUpdate", async function () {
  console.log("I am working");
  const docToUpdate = await this.model.findOne(this.getQuery());
  // console.log('docToupdate:', docToUpdate);
  if (!docToUpdate.skus) {
    console.log('a', this.schema)
    this.set({
      total_quantity: 0,
      color_list: [],
      size_list: [],
      price: {},
      skusLength: 0
    })
  }
  else {
    console.log('b')
    console.log(setPrice(docToUpdate.skus))
    this.set({
      total_quantity: (getTotalQuantity(docToUpdate.skus)),
      color_list: Object.keys(groupByField(docToUpdate.skus, 'color.color_type')),
      size_list: Object.keys(groupByField(docToUpdate.skus, 'size.size_type')),
      price: setPrice(docToUpdate.skus),
      skusLength: docToUpdate.skus.length
    })
    console.log('c')
  }
  // console.log('post: ', doc)
})

function groupByField(object, field) {
  return object.reduce((r, a) => {
    // console.log("a", a);
    function index(obj, i) {
      return obj[i]
    }
    // return field.split('.').reduce(index, a)
    r[field.split('.').reduce(index, a)] = [
      ...(r[field.split('.').reduce(index, a)] || []),
      a,
    ]
    return r
  }, {})
}

function getMin(arr) {
  return Math.min(...arr)
}

function getMax(arr) {
  return Math.max(...arr)
}

function getTotalQuantity(obj) {
  const quantity = (obj.map(d => d.quantity)).reduce((total, num) => total + num)
  return quantity
}

function setPrice(obj) {
  const minPriceBase = getMin(obj.map(d => d.price.base))
  const maxPriceBase = getMax(obj.map(d => d.price.base))
  const minPrice = getMin(obj.map(d => d.price.base * (1 - d.price.discount)))
  const maxPrice = getMax(obj.map(d => d.price.base * (1 - d.price.discount)))
  console.log(minPriceBase, maxPriceBase, minPrice, maxPrice)
  var dataObj = Object.assign({ 'currency': obj[0].price.currency }, { 'minPrice': minPrice }, { 'maxPrice': maxPrice }, { 'minPriceBase': minPriceBase }, { 'maxPriceBase': maxPriceBase })
  return dataObj
}

module.exports = mongoose.model('Product', Product)
