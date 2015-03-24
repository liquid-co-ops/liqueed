'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/auth');
var pcontroller = require('../controllers/personapi');

router.get('/signin', controller.signInForm);
router.post('/signin', controller.signIn);
router.put('/api/login', pcontroller.loginPerson);

module.exports = router;
