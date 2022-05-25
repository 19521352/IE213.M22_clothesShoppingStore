const express = require('express')
const router = express.Router()

const {
  createOrder,
  getCurrentUserOrders,
} = require('../app/controllers/OrderController')
const userController = require('../app/controllers/UserController');
router.post('/',userController.requireAuth, createOrder)
router.get('/my-order',userController.requireAuth, getCurrentUserOrders)

module.exports = router
