const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/UserController')

const {
  createOrder,
  getCurrentUserOrders,
} = require('../app/controllers/OrderController')

router.post('/', userController.requireAuth, createOrder)
router.get('/my-order', userController.requireAuth, getCurrentUserOrders)

module.exports = router
