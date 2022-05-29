const Product = require('../models/Product');

const { mutipleMongooseToObject } = require('../../util/mongoose');
const { query } = require('express');

class SiteController {

  // [GET] /home
    filter(req, res, next) {  
        const params = req.query;
        // console.log(params);
        Product.find(params)
        .then((clothesItems) => {
            res.render('home', {
            clothesItems: mutipleMongooseToObject(clothesItems),
            user:req.user, 
            isLogin: req.user,
            });
        })
        .catch(next);
    }

}


module.exports = new SiteController()