var express = require('express');
var router = express.Router();
var controller = require('../controllers/note');

/* GET all notes. */
router.get('/', controller.index);

/* POST a new note. */
router.post('/', controller.create);

module.exports = router;
