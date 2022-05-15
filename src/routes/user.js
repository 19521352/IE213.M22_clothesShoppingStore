const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

// productController.index


router.get('/login',userController.getLogin);

module.exports = router;