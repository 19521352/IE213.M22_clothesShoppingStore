const Product = require('../models/Product');
const Comments = require('../models/Comments');
const { groupByField } = require('../../util/groupByField')
const { mongooseToObject } = require('../../util/mongoose');
const { mutipleMongooseToObject } =require('../../util/mongoose');

class ProductController {
  // [GET] /products/:slug
  show(req, res, next) {
    Product.findOne({ _id: req.params.slug })
      .then((product) => {
        Comments.find({ productId: req.params.slug })
        .then((comment) => {
          res.render('products/show', {
            product: mongooseToObject(product),
            colorList: Object.keys(groupByField(product.products_list, 'color.color')),
            sizeList: Object.keys(groupByField(product.products_list, 'size_type')),
            comment: mutipleMongooseToObject(comment),
          });
        })

      })
      .catch(next);
  }

  postComment(req, res, next) {
    const Data = req.body;
    Data.rate = 5;

    const comment = new Comments(Data);
    comment.save();

    Product.findOne({ _id: req.params.slug })
      .then((product) => {
        Comments.find({ productId: req.params.slug })
        .then((comment) => {
          res.render('products/show', {
            product: mongooseToObject(product),
            colorList: Object.keys(groupByField(product.products_list, 'color.color')),
            sizeList: Object.keys(groupByField(product.products_list, 'size_type')),
            comment: mutipleMongooseToObject(comment),
          });
        })

      })
      .catch(next);


  }
  

}


module.exports = new ProductController()