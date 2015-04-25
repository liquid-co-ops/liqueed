'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/slackapi');

router.get('/', controller.doSlack);

module.exports = router;
