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
};

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
    .run();
};

function newPerson(req, res) {
    res.render('personnew', { title: 'New Person' });
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

function makePerson(req) {
    return {
        username: req.param('username'),
        name: req.param('name'),
        email: req.param('email'),
        password: req.param('password')
    }
}

module.exports = {
    index: index,
    view: view,
    newPerson: newPerson,
    addPerson: addPerson
};