const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');
const userController = require('../app/controllers/UserController');

// productController.index


router.get('/getCreate',userController.requireAdmin, productController.getCreate);
router.post('/create',userController.requireAdmin, productController.create);
router.post('/handle-form-actions', productController.handleFormActions)
router.get('/stored-products',userController.requireAdmin, productController.storedProducts);
router.post('/:id/handle-skus-form-actions', productController.handleSkusFormActions)
router.get('/:id/getCreateSku',userController.requireAdmin, productController.getCreateSku);
router.post('/:id/createSku',userController.requireAdmin, productController.createSku);
router.get('/:id/getUpdate',userController.requireAdmin, productController.getUpdate);
router.post('/:id/update',userController.requireAdmin, productController.update);
router.get('/:id/getUpdateSku/:skuId',userController.requireAdmin, productController.getUpdateSku);
router.post('/:id/updateSku/:skuId',userController.requireAdmin, productController.updateSku);
router.post('/:id/delete',userController.requireAdmin, productController.delete);
router.post('/:id/deleteSku/:skuId',userController.requireAdmin, productController.deleteSku);
router.get('/:slug', userController.requireUser, productController.show);
router.post('/:slug', productController.postComment);
router.post('/:slug/changecmt', productController.updateComment);
router.post('/:slug/deletecmt', productController.deleteComment);

module.exports = router;
