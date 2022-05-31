const mongoose = require('mongoose')

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
  },
  skuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product.skus',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    default: '',
  },
  price: {
    base: { type: Number },
    currency: { type: String },
    discount: { type: Number },
  },
})

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  cartItems: {
    type: [CartItemSchema],
    default: [],
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  shippingFee: {
    type: Number,
    default: 20000,
  },
})

CartSchema.methods.removeItem = async function (cartItemId) {
  const updatedCartItems = this.cartItems.filter(
    (item) => item._id.toString() !== cartItemId
  )

  this.cartItems = updatedCartItems
  await this.save()
  return this
  // this.cartItems = updatedCartItems
}

CartSchema.methods.clearCart = async function () {
  this.cartItems = []
  await this.save()
  return this
}

CartSchema.methods.findCartItem = function ({ productId, skuId }) {
  const itemIndex = this.cartItems.findIndex((item) => {
    return (
      item.productId.toString() === productId.toString() &&
      item.skuId.toString() === skuId.toString()
    )
  })

  return itemIndex
}

CartSchema.methods.getCartItemById = function (cartItemId) {
  return this.cartItems.findIndex((item) => {
    return item._id.toString() === cartItemId.toString()
  })
}

CartSchema.pre('save', async function () {
  if (this.cartItems.length < 1) {
    return (this.subTotal = 0)
  }

  const subTotal = this.cartItems.reduce((total, item) => {
    return total + item.price.base * (1 - item.price.discount) * item.quantity
  }, 0)

  this.subTotal = subTotal
})

module.exports = mongoose.model('Cart', CartSchema)
