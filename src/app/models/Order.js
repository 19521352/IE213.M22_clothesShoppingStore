const mongoose = require('mongoose')

const singleOrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '/images/product-placeholder.png',
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
      enum: ['Đang xử lý', 'Đang giao hàng', 'Đã huỷ', 'Thành công'],
      default: 'Đang xử lý',
    },
    paymentType: {
      type: String,
      enum: ['Thanh toán khi nhận hàng', 'Trả trước'],
      default: 'Thanh toán khi nhận hàng',
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
      city: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      subDistrict: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
