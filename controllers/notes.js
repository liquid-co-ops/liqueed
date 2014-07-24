var service = require('../services/notes');

/*
 * GET all notes
 */

exports.index = function(req, res) {
  var notes = service.getAllNotes();
  res.render(
    'notes',
    {
      title: 'Notes',
      notes: notes
    }
  );
};

exports.create = function(req, res) {
  // TODO: Deal with errors
  var result = service.addNote({text: req.param('note.text')});
  res.redirect('/notes');
};

exports.remove = function(req, res) {

};
