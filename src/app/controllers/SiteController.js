const Product = require('../models/Product');
const { getPrice } = require('../../util/products/show')


// const { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {

  // [GET] /home
  index(req, res, next) {
    Product.find({}).lean()
      .then((clothesItems) => {
        res.render('home', {
          layout: 'main',
          title: 'Trang chủ',
          user : req.user,
          isLogin: req.user,
          clothesItems: clothesItems.map(e => Object.assign(e, getPrice(e.skus)))

        });
      })
      .catch((error) => res.render('404', {
        layout: false,
        title: '404 error'
      }));

  }

}


module.exports = new SiteController()