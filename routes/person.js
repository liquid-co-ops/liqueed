'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/person');

router.get('/', controller.index);
router.get('/new', controller.newPerson);
router.post('/new', controller.addPerson);
router.get('/:id', controller.view);
router.get('/:id/edit', controller.editPerson);

module.exports = router;
