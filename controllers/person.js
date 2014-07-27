'use strict';

var service = require('../services/person');

function index(req, res) {
    var items = service.getPersons();
    res.render('personlist', { title: 'People', items: items });
};

function view(req, res) {
    var id = parseInt(req.params.id);
    var item = service.getPersonById(id);
    var projects = service.getProjects(id);
    res.render('personview', { title: 'Person', item: item, projects: projects });
};

module.exports = {
    index: index,
    view: view
};