var express = require('express');
var router = express.Router();
var controller = require('../controllers/notes');

/* GET all notes. */
router.get('/', controller.index);

/* POST a new note. */
router.post('/', controller.create);

module.exports = router;
