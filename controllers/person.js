'use strict';

var service = require('../services/person');

exports.index = function(req, res) {
    var items = service.getPersons();
    res.render('personlist', { title: 'People', items: items });
};