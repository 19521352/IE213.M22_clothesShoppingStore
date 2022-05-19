const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');

// productController.index


router.get('/create', productController.create);
router.post('/store', productController.store);
router.get('/:slug', productController.show);

module.exports = router;