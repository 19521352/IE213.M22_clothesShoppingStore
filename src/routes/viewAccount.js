const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

router.get('/', userController.requireAuth, userController.accountInfo)
      .get('/signout', userController.requireUser, userController.logout)



module.exports = router;