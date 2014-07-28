'use strict';

var service = require('../services/note');

function list(req, res) {
    var notes = service.getAllNotes();
    res.send(notes);
}

function get(req, res) {
    var id = parseInt(req.params.id);
    var item = service.getNoteById(id);
    res.send(item);
}

module.exports = {
    list: list,
    get: get
};