const Cart = require('../models/Cart')
const User = require('../models/User')
const Product = require('../models/Product')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

const createCartItem = async (req, res, next) => {
  const { productId, color, size, quantity } = req.body

  // Validate product existence
  const product = await Product.findById(productId)
  if (!product) {
    return res.send(`No product with id: ${productId}`)
  }

  // Validate sku existence
  const sku = product.getSkuByColorSize(color, size)
  if (!sku) {
    return res.send(`No sku`)
  }

  // Validate quality
  if (quantity > sku.quantity || quantity < 1) {
    return res.send('Quantity not valid')
  }

  const userId = req.user
  let cart = await Cart.findOne({ userId })
  if (!cart) {
    cart = await Cart.create({
      userId,
      cartItems: [],
    })
  }

  // Check if item is already in cart
  const itemIndex = cart.findCartItem({ productId, skuId: sku._id })

  // If item already exist
  if (itemIndex >= 0) {
    const newQuantity = cart.cartItems[itemIndex].quantity + quantity

    if (newQuantity > sku.quantity || newQuantity < 1) {
      return res.send('Quantity not valid')
    }

    cart.cartItems[itemIndex].quantity = newQuantity
    cart.cartItems[itemIndex].price = sku.price
    cart.cartItems[itemIndex].color = sku.color.color_type
    cart.cartItems[itemIndex].size = sku.size.size_type
    cart.cartItems[itemIndex].image = product.image[0]
  } else {
    cart.cartItems.push({
      productId,
      skuId: sku._id,
      quantity,
      color: sku.color.color_type,
      size: sku.size.size_type,
      price: sku.price,
      image: product.image[0] || '/images/product-placeholder.png',
    })
  }

  await cart.save()

  res.redirect('/cart')
}

// GET /cart
const getAllCartItems = async (req, res, next) => {
  // const userId = req.user
  const userId = req.user

  let cart = await Cart.findOne({ userId }).populate(
    'cartItems.productId',
    'name slug'
  )
  if (!cart) {
    // Create new cart for user if the cart not exist
    cart = await Cart.create({
      userId,
    })
  }

  res.render('cart/checkout', {
    cart: cart.cartItems.length < 1 ? null : cart.toObject(),
    total: cart.shippingFee + cart.subTotal,
  })
}

const updateCartItem = async (req, res, next) => {
  const { action, productId, color, size } = req.query

  const product = await Product.findOne({ _id: productId })
  if (!product) {
    return res.send('Sản phẩm không tồn tại')
  }
  // Check sku existence
  const sku = product.getSkuByColorSize(color, size)
  if (!sku) {
    return res.send('Sku không tồn tại')
  }

  const userId = req.user

  const cart = await Cart.findOne({ userId })
  if (!cart) {
    return res.send('Giỏ hàng không tồn tại')
  }

  const itemIndex = cart.findCartItem({ productId, skuId: sku._id })

  if (itemIndex < 0) {
    return res.send('Không tìm thấy sản phẩm trong giỏ hàng')
  }

  switch (action) {
    case 'add':
      cart.cartItems[itemIndex].quantity += 1
      if (cart.cartItems[itemIndex].quantity > sku.quantity) {
        return res.send('Số lượng không hợp lệ')
      }
      break

    case 'sub':
      cart.cartItems[itemIndex].quantity -= 1
      if (cart.cartItems[itemIndex].quantity < 1) {
        return res.send('Số lượng không hợp lệ')
      }
      break

    default:
      console.log('update problem')
      break
  }

  await cart.save()

  res.redirect('/cart')
}

const deleteCartItem = async (req, res, next) => {
  const { cartItemId } = req.body

  const userId = req.user

  const cart = await Cart.findOne({ userId })
  if (!cart) {
    return res.send('Giỏ hàng không tồn tại')
  }

  await cart.removeItem(cartItemId)

  res.redirect('/cart')
}

const deleteAllCartItems = async (req, res, next) => {
  const { id: cartId } = req.params
  const userId = req.user

  const cart = await Cart.findOne({ _id: cartId })
  if (!cart) {
    return res.send('Giỏ hàng không tồn tại')
  }

  // Check permission
  if (cart.userId.toString() !== userId) {
    return res.send('No permission')
  }

  await cart.clearCart()

  res.redirect('/cart')
}

module.exports = {
  createCartItem,
  getAllCartItems,
  updateCartItem,
  deleteCartItem,
  deleteAllCartItems,
}
