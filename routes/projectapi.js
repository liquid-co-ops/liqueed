var express = require('express');
var router = express.Router();
var controller = require('../controllers/projectapi');

router.get('/', controller.list);
router.get('/:id', controller.get);
router.get('/:id/team', controller.getTeam);
router.get('/:id/shareholder', controller.getShareholders);
router.get('/:id/share', controller.getShares);
router.get('/:id/period', controller.getPeriods);
router.get('/:id/period/:idp', controller.getPeriod);
router.get('/:id/period/:idp/assign', controller.getAssignments);
router.put('/:id/period/:idp/assign', controller.putAssignment);

module.exports = router;
