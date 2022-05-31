const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');
const userController = require('../app/controllers/UserController');
// productController.index


router.get('/getCreate', productController.getCreate);
router.post('/create', productController.create);
router.get('/stored-products', productController.storedProducts);
router.post('/handle-form-actions', productController.handleFormActions)
router.post('/:id/handle-skus-form-actions', productController.handleSkusFormActions)
router.get('/:id/getCreateSku', productController.getCreateSku);
router.post('/:id/createSku', productController.createSku);
router.get('/:id/getUpdate', productController.getUpdate);
router.post('/:id/update', productController.update);
router.get('/:id/getUpdateSku/:skuId', productController.getUpdateSku);
router.post('/:id/updateSku/:skuId', productController.updateSku);
router.post('/:id/delete', productController.delete);
router.post('/:id/deleteSku/:skuId', productController.deleteSku);
router.get('/:slug', productController.show);

module.exports = router;