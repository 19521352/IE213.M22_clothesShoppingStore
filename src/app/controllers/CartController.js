const Cart = require('../models/Cart')
const User = require('../models/User')
const Product = require('../models/Product')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

// const createCartItem = async (req, res, next) => {
//   try {
//     const { productId, color, size, quantity, skuId } = req.body
//
//     console.log(skuId)
//
//     const userId = '62890638fdc34396c526335b' // TODO: use userId from authentication middleware
//
//     // Check if user already has cart or not
//     let cart = await Cart.findOne({ userId })
//     if (!cart) {
//       // Create new cart for the user
//       cart = await Cart.create({
//         userId,
//       })
//     }
//
//     // Check product existence
//     const product = await Product.findOne({ _id: productId })
//     if (!product) {
//       // TODO: handle error
//       return res.send('Not found product')
//     }
//
//     // Check sku existence
//     // const sku = product.skus.find(
//     //   (sku) => sku.color.color === color && sku.size.size_type === size
//     // )
//     const sku = product.skus.find((sku) => sku._id.toString() === skuId)
//     if (!sku) {
//       // TODO: handle error
//       return res.send('Not found sku')
//     }
//
//     // Check quantity is valid
//     if (quantity > sku.quantity || quantity < 1) {
//       // TODO: handle error
//       return res.send('Quantity is not valid')
//     }
//
//     // Check if item is already in cart
//     const itemIndex = cart.cartItems.findIndex((cartItem) => {
//       return (
//         cartItem.productId.toString() === productId &&
//         cartItem.color === color &&
//         cartItem.size === size
//       )
//     })
//
//     if (itemIndex > -1) {
//       const newItem = { ...cart.cartItems[itemIndex]._doc }
//
//       const newQuantity = newItem.quantity + quantity
//       // Check quantity is valid
//       if (newQuantity > sku.quantity || newQuantity < 1) {
//         // TODO: handle error
//         return res.send('Quantity is not valid')
//       }
//       newItem.quantity = newQuantity
//
//       cart.cartItems[itemIndex] = newItem
//     } else {
//       // Item doesn't exists in cart
//       const cartItem = {
//         productId,
//         color,
//         size,
//         image: sku.image[0] || '',
//         quantity,
//       }
//
//       cart.cartItems.push(cartItem)
//     }
//
//     await cart.save()
//
//     res.json({
//       cart,
//     })
//   } catch (err) {
//     res.send(err)
//   }
// }

const createCartItem = async (req, res, next) => {
  const { productId, skuId, quantity } = req.body

  const product = await Product.findById(productId)
  if (!product) {
    return res.send(`No product with id: ${productId}`)
  }

  const sku = product.skus.find((sku) => sku._id.toString() === skuId)
  if (!sku) {
    return res.send(`No sku with id: ${skuId}`)
  }

  // Validate quality
  if (quantity > sku.quantity || quantity < 1) {
    return res.send('Quantity not valid')
  }

  const userId = '62890638fdc34396c526335b' // TODO: use userId from authentication middleware
  let cart = await Cart.findOne({ userId })
  if (!cart) {
    cart = await Cart.create({
      userId,
      cartItems: [],
    })
  }

  // Check if item is already in cart
  const itemIndex = cart.cartItems.findIndex(
    (item) =>
      item.productId.toString() === productId && item.skuId.toString() === skuId
  )

  // If item already exist
  if (itemIndex >= 0) {
    const newQuantity = cart.cartItems[itemIndex].quantity + quantity

    if (newQuantity > sku.quantity || newQuantity < 1) {
      return res.send('Quantity not valid')
    }

    cart.cartItems[itemIndex].quantity = newQuantity
    cart.cartItems[itemIndex].price = sku.price
    cart.cartItems[itemIndex].color = sku.color.color
    cart.cartItems[itemIndex].size = sku.size.size_type
    cart.cartItems[itemIndex].image = sku.image[0]
  } else {
    cart.cartItems.push({
      productId,
      skuId,
      quantity,
      color: sku.color.color,
      size: sku.size.size_type,
      price: sku.price,
      image: sku.image[0] || '',
    })
  }

  await cart.save()

  res.json({ cart })
}

// GET /cart
const getAllCartItems = async (req, res, next) => {
  const userId = '62890638fdc34396c526335b' // TODO: use userId from authentication middleware

  const cart = await Cart.findOne({ userId }).populate(
    'cartItems.productId',
    'name'
  )
  if (!cart) {
    return res.send('Không tồn tại giỏ hàng')
  }

  res.render('cart/checkout', {
    cart: cart.cartItems.length < 1 ? null : cart.toObject(),
    total: cart.shippingFee + cart.subTotal,
  })
}

const updateCartItem = async (req, res, next) => {
  const { action, productId, color, size } = req.query

  const product = await Product.findOne({ _id: productId }).lean()
  if (!product) {
    return res.send('Sản phẩm không tồn tại')
  }
  // Check sku existence
  const sku = product.skus.find(
    (sku) => sku.color.color === color && sku.size.size_type === size
  )
  if (!sku) {
    // TODO: handle error
    return res.send('Sku không tồn tại')
  }

  const userId = '62890638fdc34396c526335b' // TODO: use userId from authentication middleware

  const cart = await Cart.findOne({ userId })
  if (!cart) {
    return res.send('Giỏ hàng không tồn tại')
  }

  const itemIndex = cart.cartItems.findIndex((cartItem) => {
    return (
      cartItem.productId.toString() === productId &&
      cartItem.color === color &&
      cartItem.size === size
    )
  })

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

  const userId = '62890638fdc34396c526335b' // TODO: use userId from authentication middleware

  const cart = await Cart.findOne({ userId })
  if (!cart) {
    return res.send('Giỏ hàng không tồn tại')
  }

  await cart.removeItem(cartItemId)

  res.redirect('/cart')
}

const deleteAllCartItems = async (req, res, next) => {
  const { id: cartId } = req.params
  // const userId = '62880eab376ac68dbeda528c' // TODO: use userId from authentication middleware
  const userId = '62890638fdc34396c526335b' // TODO: use userId from authentication middleware

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
