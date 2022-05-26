const Product = require('../models/Product');
const Comments = require('../models/Comments');
const User = require('../models/User');
const { groupByField } = require('../../util/groupByField')
const { mongooseToObject } = require('../../util/mongoose');
const { mutipleMongooseToObject } =require('../../util/mongoose');
const { redirect } = require('express/lib/response');

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
            user:req.user, 
            isLogin: req.user,
          });
          
        })

      })
      .catch(next);
    
  }

  postComment(req, res, next) {
    // console.log(req.body);
    User.findOne({email: req.body.email}).then((user) => {
      const Data = req.body;
      Data.name = user.name;
      const comment = new Comments(Data);
      console.log(comment)
      comment.save();
    })
    .then(() => res.redirect('/products/' + req.params.slug))
  }

  updateComment(req, res, next) {
    Comments.findOneAndUpdate({_id: req.body._id}, {
      comment: req.body.newComment,
      rate: req.body.rate,
    })
    .then(() => res.redirect('/products/' + req.body.productId)) 
  }
  
  deleteComment(req, res, next) {
    Comments.deleteOne({_id: req.body._id}).catch((error) => {
      console.log('ko xoa dc');
    });
  }
}


module.exports = new ProductController()