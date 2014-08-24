'use strict';

var service = require('../services/note');

function getNoteOrRedirect(req, res, template, redirectPath) {
    var id = req.param('id');
    service.getNoteById(id, function (err, note) {
        if (note) {
            res.render(
                template,
                {
                    title: 'Note ' + note.id,
                    note:  note
                }
            );
        } else {
            res.redirect(redirectPath)
        }
    });
}

/*
 * QUERY all notes
 */

exports.index = function(req, res) {
    service.getAllNotes(function (err, notes) {
        res.render(
            'notes/list',
            {
                title: 'Notes',
                notes: notes
            }
        );
    });
};

/*
 * GET a note
 */

exports.get = function(req, res) {
    getNoteOrRedirect(req, res, 'notes/view', '/notes');
};


/*
 * POST a new note
 */

exports.create = function(req, res) {
    service.addNote({text: req.param('note.text')}, function (err, result) {
        var path = '/notes';
        if (typeof result === 'number') {
            path = '/notes/' + result;
        }
        res.redirect(path);
    });
};

/*
 *  edit a note
 */

exports.edit = function(req, res) {
    getNoteOrRedirect(req, res, 'notes/edit', '/notes');
};

/*
 *  PUT an update for a note
 */

exports.put = function(req, res) {
    var id = req.param('id');
    service.updateNoteById(id, {text: req.param('note.text')}, function (err, result) {
        res.redirect('/notes/' + id);
    });
};

/*
 *  DELETE a note
 */

exports.remove = function(req, res) {
    service.removeNoteById(req.param('id'), function (err, result) {
        res.redirect('/notes');
    });
};
