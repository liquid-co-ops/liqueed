'use strict';

var service = require('../services/note');

function list(req, res) {
    service.getAllNotes(function (err, notes) {
        res.send(notes);
    });
}

function get(req, res) {
    var id = parseInt(req.params.id);
    service.getNoteById(id, function (err, item) {
        res.send(item);
    });
}

module.exports = {
    list: list,
    get: get
};