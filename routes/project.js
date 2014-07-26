var express = require('express');
var router = express.Router();
var controller = require('../controllers/project');

router.get('/', controller.index);
router.get('/:id', controller.view);
router.get('/:id/period/:idp', controller.viewPeriod);

module.exports = router;
