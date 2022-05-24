const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');
const userController = require('../app/controllers/UserController');
// productController.index

router.post('/:slug', productController.postComment);
router.get('/:slug',userController.requireUser ,productController.show);

module.exports = router;