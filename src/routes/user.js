const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

// productController.index


router.get('/',userController.getLogin)
      .post('/',userController.Register)
      

module.exports = router;