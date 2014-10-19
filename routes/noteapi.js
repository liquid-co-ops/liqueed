'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/noteapi');

router.get('/', controller.list);
router.get('/:id', controller.get);

module.exports = router;
