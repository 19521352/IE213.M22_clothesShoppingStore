const Product = require('../models/Product');
const { groupByField } = require('../../util/groupByField')
const { getPrice, getTotalQuantity } = require('../../util/products/show')
// const { mongooseToObject } = require('../../util/mongoose');

class ProductController {

  // [GET] /products/:slug
  show(req, res, next) {
    Product.findOne({ slug: req.params.slug }).lean()
      .then((product) => {
        res.render('products/show', {
          layout: 'main',
          title: product.name,
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

  // [GET] /products/create
  create(req, res, next) {
    res.render('products/create', {
      layout: 'subordinate',
      title: 'Điều chỉnh sản phẩm',
    })
  }

  // [POST] /products/store
  store(req, res, next) {
    // res.render('products/store', {
    //   layout: 'subordinate',
    //   title: 'Điều chỉnh sản phẩm',
    // })
  }
}


module.exports = new ProductController()