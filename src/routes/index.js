const siteRouter = require('./site')
const productsRouter = require('./products')
const cartRouter = require('./cart')
const orderRouter = require('./orders')
const Product = require('../app/models/Product')
const account = require('./viewAccount')

function route(app) {
  app.use('/products', productsRouter)
  app.use('/login', userRouter)
  app.use('/cart', cartRouter)
  app.use('/orders', orderRouter)
  app.use('/account', account);
  app.use('/', siteRouter)
}
module.exports = route
