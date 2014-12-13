'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/projectapi');

router.get('/', controller.list);
router.post('/', controller.addProject);
router.get('/:id', controller.get);

router.get('/:id/team', controller.getTeam);
router.put('/:id/team/:pid', controller.addPersonToTeam);

router.get('/:id/shareholder', controller.getShareholders);

router.get('/:id/share', controller.getSharesByProject);
router.get('/:id/closedshare', controller.getClosedSharesByProject);

router.get('/:id/period', controller.getPeriods);
router.get('/:id/period/:idp', controller.getPeriod);
router.get('/:id/period/:idp/share', controller.getSharesByPeriod);
router.get('/:id/period/:idp/closedshare', controller.getClosedSharesByPeriod);
router.get('/:id/period/:idp/assign', controller.getAssignments);
router.post('/:id/period', controller.addPeriod);
router.put('/:id/period/:idp/assign', controller.putAssignment);
router.put('/:id/period/:idp/assigns', controller.putAssignments);
router.put('/:id/period/:idp/open', controller.openPeriod);
router.put('/:id/period/:idp/close', controller.closePeriod);

router.get('/:id/person/:idp/givenassign', controller.getGivenAssignmentsByProjectPerson);
router.get('/:id/person/:idp/receivedassign', controller.getReceivedAssignmentsByProjectPerson);

module.exports = router;
