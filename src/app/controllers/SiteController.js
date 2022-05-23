const Product = require('../models/Product');

const { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {

  // [GET] /home
  index(req, res, next) {
    
      Product.find({})
      .then((clothesItems) => {
        res.render('home', {
          clothesItems: mutipleMongooseToObject(clothesItems),
          isSignin: req.user,
        });
      })
      .catch(next);

  }

}


module.exports = new SiteController()