const siteRouter = require('./site');
const productsRouter = require('./products');
const userRouter = require('./user');

function route(app) {
  app.use('/products', productsRouter);

  app.use('/',userRouter);
  
}

module.exports = route;