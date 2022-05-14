const siteRouter = require('./site');
const productsRouter = require('./products');


function route(app) {
  app.use('/products', productsRouter);

  app.use('/', siteRouter);
  
}

module.exports = route;