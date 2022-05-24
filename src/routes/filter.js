const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
const userController = require('../app/controllers/UserController');

router.get('/', userController.requireUser, siteController.index);


module.exports = router;