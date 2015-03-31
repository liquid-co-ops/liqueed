'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/dcategory');

router.get('/', controller.index);

module.exports = router;
