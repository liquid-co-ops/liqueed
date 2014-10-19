'use strict';

var service = require('../services/person');

function getId(id) {
    if (id && id.length && id.length > 10)
        return id;

    return parseInt(id);
}

function list(req, res) {
    service.getPersons(function (err, items) {
        res.send(items);
    });
}

function get(req, res) {
    var id = getId(req.params.id);
    service.getPersonById(id, function (err, item) {
        res.send(item);
    });
}

function getProjects(req, res) {
    var id = getId(req.params.id);
    service.getProjects(id, function (err, items) {
        res.send(items);
    });
}

function loginPerson(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    service.loginPerson(username, password, function (err, items) {
        if (err)
            res.send({ error: err });
        else
            res.send(items);
    });
}

module.exports = {
    list: list,
    get: get,
    getProjects: getProjects,
    loginPerson: loginPerson
}
