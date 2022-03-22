const Clothes = require('../models/Clothes');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
  // [GET] /home
  index(req, res, next) {
    Clothes.find({})
      .then((clothesItems) => {
        res.render('home', {
          clothesItems: mutipleMongooseToObject(clothesItems),
        });
      })
      .catch(next);
  }

  // res.json(Clothes)
}


module.exports = new SiteController()