const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
const userController = require('../app/controllers/UserController');
// siteController.index

router.get('/', siteController.index);

module.exports = router;