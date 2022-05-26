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
    type: mongoose.Types.ObjectId,
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
    default: 2,
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

// UserSchema.pre('save', async function () {
//   // console.log(this.modifiedPaths())
//   // console.log(this.isModified('name'))
//   // Avoid hashing password when changing other fields
//   if (!this.isModified('password')) return
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
// })

CartSchema.pre('save', async function () {
  if (this.cartItems.length < 1) {
    return (this.subTotal = 0)
  }

  const subTotal = this.cartItems.reduce((total, item) => {
    return total + item.price.discount * item.quantity
  }, 0)

  this.subTotal = subTotal
  console.log(this.subTotal)
})

module.exports = mongoose.model('Cart', CartSchema)
