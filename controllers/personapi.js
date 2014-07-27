'use strict';

var service = require('../services/person');

function list(req, res) {
    var items = service.getPersons();
    res.send(items);
};

function get(req, res) {
    var id = parseInt(req.params.id);
    var item = service.getPersonById(id);
    res.send(item);
};

function getProjects(req, res) {
    var id = parseInt(req.params.id);
    var items = service.getProjects(id);
    res.send(items);
};

module.exports = {
    list: list,
    get: get,
    getProjects: getProjects
};