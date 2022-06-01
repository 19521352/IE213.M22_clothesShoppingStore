const Cart = require('../models/Cart')
const User = require('../models/User')
const Product = require('../models/Product')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

const createCartItem = async (req, res, next) => {
  const { productId, color, size } = req.body
  let { quantity } = req.body
  quantity = parseInt(quantity)

  // Validate product existence
  const product = await Product.findById(productId)
  if (!product) {
    req.flash('error', 'Không tìm thấy sản phẩm')
    return res.redirect(`/`)
  }

  // Validate sku existence
  const sku = product.getSkuByColorSize(color, size)
  if (!sku) {
    req.flash('error', 'Không tìm thấy sku của sản phẩm')
    return res.redirect(`/products/${product.slug}`)
  }

  // Validate quality
  if (quantity < 1 || quantity > sku.quantity) {
    req.flash('error', 'Số lượng không hợp lệ')
    return res.redirect(`/products/${product.slug}`)
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

  // If item already exist in cart
  if (itemIndex >= 0) {
    const newQuantity = cart.cartItems[itemIndex].quantity + quantity

    if (newQuantity > sku.quantity || newQuantity < 1) {
      console.log(`newQuantity: ${newQuantity}`)
      req.flash('error', 'Số lượng không hợp lệ')
      return res.redirect(`/products/${product.slug}`)
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

  req.flash('success', 'Thêm sản phẩm vào giỏ hàng thành công')
  res.redirect(`/products/${product.slug}`)
}

// GET /cart
const getAllCartItems = async (req, res, next) => {
  const userId = req.user // TODO: use userId from authentication middleware

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
    layout: 'subordinate',
    cart: cart.cartItems.length < 1 ? null : cart.toObject(),
    total: cart.shippingFee + cart.subTotal,
    user: req.user,
    isLogin: req.user,
  })
}

const updateCartItem = async (req, res, next) => {
  const { cartItemId, action } = req.body

  const userId = req.user

  const cart = await Cart.findOne({ userId })
  if (!cart) {
    return res.json({ msg: 'No cart' })
    req.flash('error', 'Giỏ hàng không tồn tại')
    return res.redirect('/cart')
  }

  const itemIndex = cart.getCartItemById(cartItemId)

  if (itemIndex < 0) {
    return res.json({ msg: 'Không tìm thấy sản phẩm trong giỏ hàng' })
  }

  const { productId, skuId } = cart.cartItems[itemIndex]

  const product = await Product.findOne({ _id: productId })
  if (!product) {
    return res.status(404).json({ msg: 'Sản phẩm không tồn tại' })
  }
  // Check sku existence
  const sku = product.getSkuById(skuId)
  if (!sku) {
    return res.status(404).json({ msg: 'Sku không tồn tại' })
  }

  switch (action) {
    case 'increase':
      cart.cartItems[itemIndex].quantity += 1
      if (cart.cartItems[itemIndex].quantity > sku.quantity) {
        return res.status(404).json({ msg: 'Số lượng không hợp lệ' })
      }
      break

    case 'decrease':
      cart.cartItems[itemIndex].quantity -= 1
      if (cart.cartItems[itemIndex].quantity < 1) {
        return res.status(404).json({ msg: 'Số lượng không hợp lệ' })
      }
      break

    default:
      console.log('update problem')
      break
  }

  await cart.save()

  return res.json({ updatedCartItem: cart.cartItems[itemIndex], cart })
}

const deleteCartItem = async (req, res, next) => {
  try {
    const cartItemId = req.params.id

    const userId = req.user

    const cart = await Cart.findOne({ userId })
    if (!cart) {
      return res.status(404).json({ msg: 'Không tìm thấy giỏ hàng' })
    }

    await cart.removeItem(cartItemId)

    res.status(200).json({ cart })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi không thể xoá' })
  }
}

const deleteAllCartItems = async (req, res, next) => {
  const { id: cartId } = req.params
  const userId = req.user

  const cart = await Cart.findOne({ _id: cartId })
  if (!cart) {
    req.flash('error', 'Giỏ hàng không tồn tại')
    return res.redirect('/cart')
  }

  // Check permission
  if (cart.userId.toString() !== userId) {
    req.flash('error', 'Tài khoản không có quyền xoá giỏ hàng này')
    return res.redirect('/cart')
  }

  await cart.clearCart()

  req.flash('success', 'Xoá giỏ hàng thành công!')
  res.redirect('/cart')
}

module.exports = {
  createCartItem,
  getAllCartItems,
  updateCartItem,
  deleteCartItem,
  deleteAllCartItems,
}
