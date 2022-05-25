const express = require('express')
const router = express.Router()

const {
  getAllCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  deleteAllCartItems,
} = require('../app/controllers/CartController')
const userController = require('../app/controllers/UserController');
// TODO: add authentication
router.get('/',userController.requireAuth,getAllCartItems)
router.post('/',userController.requireAuth,createCartItem)
router.get('/update',userController.requireAuth, updateCartItem)
router.post('/delete-item',userController.requireAuth, deleteCartItem)
router.post('/delete/:id',userController.requireAuth, deleteAllCartItems)

module.exports = router
