var express = require('express');
var router = express.Router();
var controller = require('../controllers/person');

/* GET home page. */
router.get('/', controller.index);

module.exports = router;
