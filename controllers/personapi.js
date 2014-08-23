'use strict';

var service = require('../services/person');

function list(req, res) {
    service.getPersons(function (err, items) {
        res.send(items);
    });
};

function get(req, res) {
    var id = parseInt(req.params.id);
    service.getPersonById(id, function (err, item) {
        res.send(item);
    });
};

function getProjects(req, res) {
    var id = parseInt(req.params.id);
    service.getProjects(id, function (err, items) {
        res.send(items);
    });
};

module.exports = {
    list: list,
    get: get,
    getProjects: getProjects
};