const siteRouter = require('./site');
const productsRouter = require('./products');
const userRouter = require('./user');
const account = require('./viewAccount')

function route(app) {
  app.use('/products', productsRouter);
  app.use('/login',userRouter);
  app.use('/',siteRouter);
  app.use('/account', account);
}

module.exports = route;