const siteRouter = require('./site')
const productsRouter = require('./products')
const userRouter = require('./user')
const cartRouter = require('./cart')
const orderRouter = require('./orders')
const Product = require('../app/models/Product')

function route(app) {
  app.use('/products', productsRouter)
  app.use('/login', userRouter)
  app.use('/cart', cartRouter)
  app.use('/order', orderRouter)
  app.use('/', siteRouter)
}
module.exports = route
