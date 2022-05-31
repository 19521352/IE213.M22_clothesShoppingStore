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
const userController = require('../app/controllers/UserController');
// TODO: add authentication
router.post('/', userController.requireAuth, createCartItem)
router.get('/', userController.requireAuth, getAllCartItems)
router.patch('/update-item/:id', userController.requireAuth, updateCartItem)
router.delete('/delete-item/:id', userController.requireAuth, deleteCartItem)
router.post('/delete/:id', userController.requireAuth, deleteAllCartItems)

module.exports = router
