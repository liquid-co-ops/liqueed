'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/auth');
var pcontroller = require('../controllers/personapi');

router.get('/signin', controller.signInForm);
router.post('/signin', controller.signIn);
router.post('/api/signin', pcontroller.loginPerson);

module.exports = router;
