const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');
const userController = require('../app/controllers/UserController');
// productController.index


router.post('/:slug', productController.postComment);
router.post('/:slug/changecmt', productController.updateComment);
router.post('/:slug/deletecmt', productController.deleteComment);
router.get('/:slug',userController.requireUser ,productController.show);

module.exports = router;