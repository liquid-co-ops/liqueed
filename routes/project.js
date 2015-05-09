'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/project');
var dcontroller = require('../controllers/decision');
var dccontroller = require('../controllers/dcategory');

router.get('/', controller.index);
router.get('/new', controller.newProject);
router.post('/new', controller.addProject);
router.get('/:id', controller.view);

router.get('/:projectid/dcategory', dccontroller.index);
router.get('/:projectid/dcategory/new', dccontroller.newCategory);
router.post('/:projectid/dcategory/new', dccontroller.addCategory);
router.get('/:projectid/dcategory/:id', dccontroller.view);

router.get('/:projectid/decision', dcontroller.index);
router.get('/:projectid/decision/new', dcontroller.newDecision);
router.post('/:projectid/decision/new', dcontroller.addDecision);
router.get('/:projectid/decision/:id', dcontroller.view);

router.get('/:id/person/new', controller.newTeamMember);
router.post('/:id/person/new', controller.addTeamMember);
router.get('/:id/person/:pid/remove', controller.removeTeamMember);

router.get('/:id/period/new', controller.newPeriod);
router.post('/:id/period/new', controller.addPeriod);
router.get('/:id/period/:idp', controller.viewPeriod);
router.get('/:id/period/:idp/open', controller.openPeriod);
router.get('/:id/period/:idp/close', controller.closePeriod);
router.get('/:id/period/:idp/edit', controller.editPeriod);
router.post('/:id/period/:idp/edit', controller.updatePeriod);
router.get('/:id/period/:idp/assignment/matrix', controller.getPeriodMatrix);
router.post('/:id/period/:idp/assignment/matrix', controller.updatePeriodMatrix);

module.exports = router;
