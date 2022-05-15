const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
const reviewController = require('../app/controllers/ReviewController');
// siteController.index

router.get('/' ,siteController.index);

module.exports = router;