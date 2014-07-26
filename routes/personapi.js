var express = require('express');
var router = express.Router();
var controller = require('../controllers/personapi');

router.get('/', controller.list);
router.get('/:id', controller.get);

module.exports = router;
