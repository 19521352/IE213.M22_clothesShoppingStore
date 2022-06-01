const Product = require('../models/Product')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const checkPermissions = require('../../util/checkPermissions')

const createOrder = async (req, res) => {
  const userId = req.user

  const { name, phoneNumber, address } = req.body
  if (!name || !phoneNumber || !parseInt(phoneNumber) || !address) {
    req.flash('error', 'Vui lòng điền đầy đủ và chính xác các thông tin')
    return res.redirect('/cart')
  }

  const newAddress = [
    address.city,
    address.district,
    address['sub-district'],
    address.street,
  ].join(', ')

  const cart = await Cart.findOne({ userId })
  if (!cart) {
    req.flash('error', 'Giỏ hàng không tồn tại')
    return res.redirect('/cart')
  }

  const { cartItems, shippingFee } = cart
  if (!cartItems || cartItems.length < 1) {
    req.flash('error', 'Giỏ hàng trống')
    return res.redirect('/cart')
  }

  let orderItems = []
  let subtotal = 0

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.productId })
    if (!dbProduct) {
      req.flash('error', `Không tìm thấy sản phẩm với id: ${item.productId}`)
      return res.redirect('/cart')
    }

    const dbSku = dbProduct.getSkuById(item.skuId)
    if (!dbSku) {
      req.flash('error', `Không tìm thấy sku với id: ${item.skuId}`)
      return res.redirect('/cart')
    }

    // Check quantity validation
    if (item.quantity > dbSku.quantity || item.quantity < 1) {
      req.flash('error', 'Số lượng không hợp lệ')
      cart.clearCart()
      return res.redirect('/cart')
    }

    const { name, _id: productId } = dbProduct
    const {
      color: { color_type: color },
      price,
      size: { size_type: size },
    } = dbSku

    const singleOrderItem = {
      quantity: item.quantity,
      name,
      price: price.base * (1 - price.discount),
      image: dbProduct.image[0] || '/images/product-placeholder.png',
      color,
      size,
      product: productId,
    }

    // add item to orderItems list
    orderItems = [...orderItems, singleOrderItem]
    // calculate subtotal
    subtotal += item.quantity * (price.base * (1 - price.discount))

    // Decrease product with sku quantity
    dbSku.quantity -= item.quantity
    await dbProduct.save()
  }

  const total = subtotal + shippingFee

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    shippingFee,
    user: userId,
    name,
    phoneNumber,
    address: newAddress,
  })

  await cart.clearCart()

  res.redirect('/orders/my-orders')
}

// Admin only
const getAllOrders = async (req, res) => {
  let orders = await Order.find({})

  if (orders && orders.length > 0) {
    orders = orders.map((order) => order.toObject())
  }

  res.render('orders/index', { orders, layout: 'subordinate' })
}

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params

  const order = await Order.findOne({ _id: orderId }).populate(
    'orderItems.product'
  )
  if (!order) {
    req.flash('error', 'Không tìm thấy đơn hàng!')
    return res.redirect('/orders/my-orders')
  }

  console.log(order)

  const userId = req.user

  // const hasPermissions = checkPermissions(userId, order.user)
  // if (!hasPermissions) {
  //   req.flash('error', 'Bạn không có quyền xem đơn hàng này!')
  //   return res.redirect('/orders/my-orders')
  // }

  res.render('orders/show', {
    order: order.toObject(),
    layout: 'subordinate',
  })
}

const getCurrentUserOrders = async (req, res) => {
  const userId = req.user
  let orders = await Order.find({ user: userId }).populate('orderItems.product')

  if (orders && orders.length > 0) {
    orders = orders.map((order) => order.toObject())
  }

  res.render('orders/my-orders', {
    orders,
    layout: 'subordinate',
    isLogin: req.user,
  })
}

// Admin only
const getEdit = async (req, res) => {
  const { id: orderId } = req.params

  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    req.flash('error', 'Không tìm thấy đơn hàng!')
    return res.redirect('/orders/my-orders')
  }

  const userId = req.user

  //TODO: check admin
  // const hasPermissions = checkPermissions(userId, order.user)
  // if (!hasPermissions) {
  //   req.flash('error', 'Bạn không có quyền xem đơn hàng này!')
  //   return res.redirect('/orders/my-orders')
  // }

  res.render('orders/edit', {
    order: order.toObject(),
    layout: 'subordinate',
  })
}

// Admin only
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params

  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    req.flash('error', 'Không tìm thấy đơn hàng!')
    return res.redirect('/orders/my-orders')
  }

  const { status } = req.body
  const validStatus = ['Đang xử lý', 'Đang giao hàng', 'Đã huỷ', 'Thành công']
  if (!status || !validStatus.includes(status)) {
    req.flash('error', 'Trạng thái không hợp lệ')
    return res.redirect(`/orders/edit/${orderId}`)
  }

  //TODO: check permission

  order.status = status
  await order.save()

  req.flash('success', 'Thay đổi trạng thái đơn hàng thành công')
  res.redirect(`/orders/edit/${orderId}`)
}

const cancelOrder = async (req, res) => {
  const { id: orderId } = req.params

  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    req.flash('error', 'Không tìm thấy đơn hàng!')
    return res.redirect('/orders/my-orders')
  }

  // Check permission
  const userId = req.user

  const hasPermissions = checkPermissions(userId, order.user)
  if (!hasPermissions) {
    req.flash('error', 'Bạn không có quyền huỷ đơn hàng này!')
    return res.redirect('/orders/my-orders')
  }

  if (order.status !== 'Đang xử lý') {
    req.flash('error', 'Không thể huỷ đơn hàng!')
    return res.redirect(`/orders/${orderId}`)
  }

  order.status = 'Đã huỷ'
  await order.save()

  req.flash('success', 'Huỷ đơn hàng thành công!')
  res.redirect(`/orders/${order._id}`)
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
  cancelOrder,
  getEdit,
}
