const express = require('express')
const router = express.Router()

const {
  createOrder,
  getCurrentUserOrders,
} = require('../app/controllers/OrderController')

router.post('/', createOrder)
router.get('/my-order', getCurrentUserOrders)

module.exports = router
