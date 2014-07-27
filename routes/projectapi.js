var express = require('express');
var router = express.Router();
var controller = require('../controllers/projectapi');

router.get('/', controller.list);
router.get('/:id', controller.get);
router.get('/:id/team', controller.getTeam);
router.get('/:id/period', controller.getPeriods);
router.get('/:id/period/:idp', controller.getPeriod);
router.get('/:id/period/:idp/assignment', controller.getAssignments);
router.put('/:id/period/:idp/assignment', controller.putAssignment);

module.exports = router;
