const mongoose = require('mongoose')

const singleOrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      'https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640',
  },
  price: {
    type: Number,
    required: true,
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
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: 'User',
    },
    shippingFee: {
      type: Number,
      required: [true, 'Please provide shippingFee'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Please provide subtotal'],
    },
    total: {
      type: Number,
      required: [true, 'Please provide total'],
    },
    orderItems: [singleOrderItemSchema],
    status: {
      type: String,
      enum: ['Đang xử lý', 'Đã huỷ', 'Thành công'],
      default: 'Đang xử lý',
    },
    paymentType: {
      type: String,
      enum: ['COD', 'Trả trước'],
      default: 'COD',
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
