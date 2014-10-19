'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/note');

/* QUERY all notes. */
router.get('/', controller.index);

/* GET a note. */
router.get('/:id', controller.get);

/* POST a new note. */
router.post('/', controller.create);

/* DELETE a note */
router.post('/:id/delete', controller.remove);

/* edit a note */
router.get('/:id/edit', controller.edit);

/* PUT a note */
router.post('/:id', controller.put);

module.exports = router;
