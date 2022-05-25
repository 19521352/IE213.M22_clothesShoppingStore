const express = require('express')
const router = express.Router()

const {
  getAllCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  deleteAllCartItems,
} = require('../app/controllers/CartController')

// TODO: add authentication
router.get('/', getAllCartItems)
router.post('/', createCartItem)
router.get('/update', updateCartItem)
router.post('/delete-item', deleteCartItem)
router.post('/delete/:id', deleteAllCartItems)

module.exports = router
