const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/UserController')

const {
  createOrder,
  getCurrentUserOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  getEdit,
  updateOrder,
} = require('../app/controllers/OrderController')

router.post('/', userController.requireAuth, createOrder)
router.get('/', userController.requireAdmin, getAllOrders) //Admin only
router.get('/my-orders', userController.requireAuth, getCurrentUserOrders)
router.post('/cancel/:id', userController.requireAuth, cancelOrder)
router.get('/edit/:id', userController.requireAdmin, getEdit) //Admin only
router.post('/edit/:id', userController.requireAdmin, updateOrder) //Admin only
router.get('/:id', userController.requireAuth, getSingleOrder)

module.exports = router
