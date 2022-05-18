const Product = require('../models/Product');

const { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {

  // [GET] /home
  index(req, res, next) {
    console.log(req.user)
      Product.find({})
      .then((clothesItems) => {
        res.render('home', {
          clothesItems: mutipleMongooseToObject(clothesItems),
        });
      })
      .catch(next);

  }

}


module.exports = new SiteController()