const express = require('express');
const router = express.Router();

const filterController = require('../app/controllers/FilterController');
const userController = require('../app/controllers/UserController');

router.get('/', userController.requireUser, filterController.filter);


module.exports = router;