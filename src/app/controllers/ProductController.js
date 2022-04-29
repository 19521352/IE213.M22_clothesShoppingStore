const Product = require('../models/Product');
const { groupByField } = require('../../util/groupByField')
const { mongooseToObject } = require('../../util/mongoose');

class ProductController {
  // [GET] /products/:slug
  show(req, res, next) {
    Product.findOne({ _id: req.params.slug })
      .then((product) =>
        res.render('products/show', {
          product: mongooseToObject(product),
          colorList: Object.keys(groupByField(product.products_list, 'color.color')),
          sizeList: Object.keys(groupByField(product.products_list, 'size_type'))
        }),
        // res.json(groupByField(product.products_list, 'color.color'))
      )
      .catch(next);
  }

}


module.exports = new ProductController()