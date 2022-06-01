const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/UserController')

const {
  createOrder,
  getCurrentUserOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  getEditStatus,
  getEditInfo,
  updateOrderInfo,
  updateOrderStatus,
} = require('../app/controllers/OrderController')

router.post('/', userController.requireAuth, createOrder)
router.get('/', userController.requireAdmin, getAllOrders) //Admin only
router.get('/my-orders', userController.requireAuth, getCurrentUserOrders)
router.post('/cancel/:id', userController.requireAuth, cancelOrder)
router.get('/edit-status/:id', userController.requireAdmin, getEditStatus) //Admin only
router.post('/edit-status/:id', userController.requireAdmin, updateOrderStatus) //Admin only
router.get('/edit-info/:id', userController.requireAuth, getEditInfo)
router.post('/edit-info/:id', userController.requireAuth, updateOrderInfo)
router.get('/:id', userController.requireAuth, getSingleOrder)

module.exports = router
