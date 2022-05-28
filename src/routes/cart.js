const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/UserController')

const {
  getAllCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  deleteAllCartItems,
} = require('../app/controllers/CartController')

// TODO: add authentication
router.post('/', userController.requireAuth, createCartItem)
router.get('/', userController.requireAuth, getAllCartItems)
router.get('/update', userController.requireAuth, updateCartItem)
router.post('/delete-item', userController.requireAuth, deleteCartItem)
router.post('/delete/:id', userController.requireAuth, deleteAllCartItems)

module.exports = router
