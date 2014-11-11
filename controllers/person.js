'use strict';

var service = require('../services/person');
var async = require('simpleasync');

function getId(id) {
    if (id && id.length && id.length > 10)
        return id;
        
    return parseInt(id);
}

function index(req, res) {
    service.getPersons(function (err, items) {
        if (err)
            throw err;
            
        res.render('personlist', { title: 'People', items: items });
    });
}

function view(req, res) {
    var id = getId(req.params.id);
    
    var model = {
        title: 'Person'
    };
    
    async()
    .then(function (data, next) { service.getPersonById(id, next); })
    .then(function (data, next) {
        model.item = data;
        service.getProjects(id, next)
    })
    .then(function (data, next) {
        model.projects = data;
        res.render('personview', model);
    })
    .fail(function (err) {
        res.render('error', { title: 'Error', error: err });
    })
    .run();
}

function newPerson(req, res) {
    res.render('personnew', { title: 'New Person' });
}

function editPerson(req, res) {
    var id = getId(req.params.id);
    
    var model = {
        title: 'Edit Person'
    };
    
    async()
    .then(function (data, next) { service.getPersonById(id, next); })
    .then(function (data, next) {
        model.item = {
            id: data.id,
            username: data.username,
            name: data.name,
            email: data.email
        };
        res.render('personedit', model);
    })
    .fail(function (err) {
        res.render('error', { title: 'Error', error: err });
    })
    .run();
}

function makePerson(req) {
    return {
        username: req.param('username'),
        name: req.param('name'),
        email: req.param('email'),
        password: req.param('password')
    }
}

function addPerson(req, res) {
    var persona = makePerson(req);
    service.addPerson(persona, function (err, id) {
        if (!req.params)
            req.params = { };
        req.params.id = id;
        view(req, res);
    });
}

function updatePerson(req, res) {
    var id = getId(req.params.id);
    
    var persona = {
        username: req.param('username'),
        name: req.param('name'),
        email: req.param('email')
    };
    
    service.updatePerson(id, persona, function (err, id) {
        if (!req.params)
            req.params = { };
        view(req, res);
    });
}

module.exports = {
    index: index,
    view: view,
    newPerson: newPerson,
    addPerson: addPerson,
    editPerson: editPerson,
    updatePerson: updatePerson
};