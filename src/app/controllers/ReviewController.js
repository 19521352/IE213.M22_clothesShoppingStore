const Comments = require('../models/Comments');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose');


class ReviewController {
  viewComments(req, res, next) {
    // res.render('product-details.hbs');
    Comments.find({})
      .then((comment) => {
        res.render('product-details', {
          comment: mutipleMongooseToObject(comment)
        });
      })
      .catch(next);
  }

  postComment(req, res, next) {
    const Data = req.body
    Data.rate = 5;
    const comment = new Comments(Data);
    comment.save();
    res.render('product-details');
    
  }
}


module.exports = new ReviewController()