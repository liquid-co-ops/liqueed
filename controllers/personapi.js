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

function getPendingShareProjects(req, res) {
    var id = getId(req.params.id);
    service.getPendingShareProjects(id, function (err, items) {
        if (err) {
            res.send({ error: err });
        }  else {
            res.send(items);
        }
    });
}

function loginPerson(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    service.loginPerson(username, password, function (err, items) {
        if (err)
            res.send({ error: err });
        else {
            if (req.session)
                req.session.user = { username: username };
            res.send(items);
        }
    });
}

function updatePassword(req, res) {
    var id = getId(req.params.id);
    var password = req.body.password;
    var persona = {
        password: password
    };
    
    service.updatePerson(id, persona, function (err, id) {
        if (err)
            res.send({ error: err });
        else
            res.send(true);
    });
}

module.exports = {
    list: list,
    get: get,
    getProjects: getProjects,
    loginPerson: loginPerson,
    getPendingShareProjects:getPendingShareProjects,
    updatePassword: updatePassword
}

