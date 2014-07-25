'use strict';

var service = require('../services/note');

/*
 * QUERY all notes
 */

exports.index = function(req, res) {
  var notes = service.getAllNotes();
  res.render(
    'notes/list',
    {
      title: 'Notes',
      notes: notes,
      flash: req.flash()
    }
  );
};

/*
 * GET a note
 */

function getNoteOrRedirect(req, res, template, redirectPath) {
  var note = service.getNoteById(req.param('id'));
  if (note) {
    res.render(
      template,
      {
        title: 'Note ' + note.id,
        note:  note,
        flash: req.flash()
      }
    );
  } else {
    res.redirect(redirectPath)
  }
}
exports.get = function(req, res) {
  getNoteOrRedirect(req, res, 'notes/view', '/notes');
};


/*
 * POST a new note
 */

exports.create = function(req, res) {
  var result = service.addNote({text: req.param('note.text')});
  var path = '/notes';
  var messageType, message;
  if (typeof result === 'number') {
    path = '/notes/' + result;
    messageType = 'success';
    message = 'Note successfully created!';
  } else {
    messageType = 'error';
    message = 'Uh oh, something went wrong';
  }
  req.flash(messageType, message);
  res.redirect(path);
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
  var result = service.updateNoteById(id, {text: req.param('note.text')});
  req.flash('success', 'Note successfully updated');
  res.redirect('/notes/' + id);
};

/*
 *  DELETE a note
 */

exports.remove = function(req, res) {
  var result = service.removeNoteById(req.param('id'));
  req.flash('success', 'Note successfully removed');
  res.redirect('/notes');
};
