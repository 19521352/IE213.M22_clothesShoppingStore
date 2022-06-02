const Product = require('../models/Product')
const { getPrice } = require('../../util/products/show')
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { query } = require('express');

class SiteController {

  // [GET] /home
    filter(req, res, next) {
        const params = req.query;
        // console.log(params);
        // Product.find(params)
        // .then((clothesItems) => {
        //     res.render('home', {
        //     clothesItems: clothesItems.map(e => Object.assign(e, getPrice(e.skus))),
        //     user:req.user,
        //     isLogin: req.user,
        //     });
        // })
        // .catch(next);
        
        let productQuery = Product.find(params).lean()

        if (req.query.hasOwnProperty('_sort')) {
        productQuery = productQuery.sort({
            [req.query.column]: [req.query.type.split('.')]
        })
        }
        Promise.all([productQuery])
        .then(([clothesItems]) => {
            res.render('home', {
            layout: 'main',
            title: 'Trang chủ',
            user : req.user,
            isLogin: req.user,
            clothesItems: clothesItems.map(e => Object.assign(e, getPrice(e.skus)))

            });
        })
        .catch((error) =>
            res.render('404', {
            layout: false,
            title: '404 error',
            })
        )

    }
    

}


module.exports = new SiteController()
