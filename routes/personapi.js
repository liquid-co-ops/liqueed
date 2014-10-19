'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/personapi');

router.get('/', controller.list);
router.put('/login', controller.loginPerson);
router.get('/:id', controller.get);
router.get('/:id/project', controller.getProjects);

module.exports = router;
