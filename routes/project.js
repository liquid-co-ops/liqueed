'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/project');

router.get('/', controller.index);
router.get('/new', controller.newProject);
router.post('/new', controller.addProject);
router.get('/:id', controller.view);

router.get('/:id/person/new', controller.newTeamMember);
router.post('/:id/person/new', controller.addTeamMember);
router.get('/:id/person/:pid/remove', controller.removeTeamMember);

router.get('/:id/period/new', controller.newPeriod);
router.post('/:id/period/new', controller.addPeriod);
router.get('/:id/period/:idp', controller.viewPeriod);
router.get('/:id/period/:idp/open', controller.openPeriod);
router.get('/:id/period/:idp/close', controller.closePeriod);

module.exports = router;
