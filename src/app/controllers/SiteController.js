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
          clothesItems: clothesItems.map(e => Object.assign(e, getPrice(e.skus)))

        });
        // res.json(clothesItems.map(e => Object.assign(e, getPrice(e.skus))))
      })
      .catch(next);

  }

}


module.exports = new SiteController()