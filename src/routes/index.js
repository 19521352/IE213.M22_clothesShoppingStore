const siteRouter = require('./site')
const productsRouter = require('./products')
const userRouter = require('./user')
const cartRouter = require('./cart')
const orderRouter = require('./orders')
const Product = require('../app/models/Product')
const account = require('./viewAccount')

function route(app) {
  app.use('/products', productsRouter)
  app.use('/login', userRouter)
  app.use('/cart', cartRouter)
  app.use('/order', orderRouter)
<<<<<<< HEAD
  app.use('/login', userRouter);
  app.use('/account', account);
=======
  app.use('/account', account)
>>>>>>> de0de7dd4cd0ef75d87c2f67483341a526521cea
  app.use('/', siteRouter)
}
module.exports = route
