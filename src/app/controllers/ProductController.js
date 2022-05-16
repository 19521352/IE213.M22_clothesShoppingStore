const Product = require('../models/Product');
const { groupByField } = require('../../util/groupByField')
const { getPrice, getTotalQuantity } = require('../../util/products/show')
// const { mongooseToObject } = require('../../util/mongoose');

class ProductController {
  // [GET] /products/:slug
  show(req, res, next) {
    Product.findOne({ _id: req.params.slug }).lean()
      .then((product) => {
        res.render('products/show', {
          product: product,
          colorList: groupByField(product.skus, 'color.color'),
          sizeList: groupByField(product.skus, 'size.size_type'),
          priceDetail: getPrice(product.skus),
          totalQuantity: getTotalQuantity(product.skus)
        })
        // res.json(product)
      },
      )
      .catch(next);
  }
}


module.exports = new ProductController()